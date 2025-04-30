import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useRef, useEffect, useReducer, useState} from 'react';
import WebRTCFunctions from '../engine/WebRTC_Functions';
import RNFS_Functions from '../engine/RNFS_Functions';
import Colors from '../../constants/Colors';
import {getItem} from '../../utilis/storage';
import firestore from '@react-native-firebase/firestore';
import CallScreen from './CallScreen';
import InCallManager from 'react-native-incall-manager';
import {RTCIceCandidate} from 'react-native-webrtc';
import {ChatHead} from './components/ChatHead';
import {ChatBody} from './components/ChatBody';
import {ChatBottom} from './components/ChatBottom';
import WaitingScreen from './WaitingScreen';
import {reducer} from './reducer';
import BackgroundTimer from 'react-native-background-timer';

const ChatScreen = ({route, navigation}) => {
  const [time, setTime] = useState('00:00:00');

  const [state, dispatch] = useReducer(reducer, {
    chatname: null,
    status: null,
    waiting: true,
    callType: null,
    img: null,
    isCalling: false,
    messages: [],
    isVoiceCall: false,
    isReceivingCall: false,
    offer: null,
    answered: false,
    isParticipantVideoOn: true,
    localStream: null,
    remoteStream: null,
    offerCandidates: [],
    answerCandidates: [],
  });

  const {otheruser} = route?.params;
  const username = getItem('username');

  const pc = useRef();
  const pcCall = useRef();
  const sendChannel = useRef();

  useEffect(() => {
    if (otheruser) {
      dispatch({
        type: 'change_chatname',
        chatname: otheruser,
      });
      dispatch({
        type: 'change_status',
        status: 'Establishing Connection...',
      });
      WebRTCFunctions.joinChat({
        pc,
        handleReceiveMessage,
        sendChannel,
        username: otheruser,
      });
    } else {
      dispatch({
        type: 'change_status',
        status: 'Creating Chat...',
      });

      WebRTCFunctions.startChat({
        handleReceiveMessage,
        pc,
        sendChannel,
        username,
        dispatch,
      });
    }

    pc.current.onconnectionstatechange = async state => {
      if (pc.current.connectionState === 'failed') {
        endCall();
        navigation.replace('StartChat');
      } else if (pc.current.connectionState === 'connected') {
        dispatch({
          type: 'stop_waiting',
        });
        const pic = getItem('profilepic');
        const message = {
          action: 'receiverDetails',
          message: {
            name: username,
            uri: pic
              ? {
                  uri: pic,
                }
              : null,
          },
        };
        sendDetails(message);

        setTimeout(() => {
          const channelDoc = firestore().collection('Channels').doc(username);
          channelDoc.get().then(d => {
            if (d.exists) {
              channelDoc.delete();
            }
          });
        }, 30000);
      } else if (pc.current.connectionState === 'connecting') {
        dispatch({
          type: 'change_status',
          status: 'Connecting...',
        });
      }
    };
  }, []);

  const sendDetails = message => {
    if (sendChannel?.current) {
      setTimeout(() => {
        sendMessage(message);
      }, 500);
    } else {
      setTimeout(() => {
        sendDetails(message);
      }, 500);
    }
  };

  function handleReceiveMessage(e) {
    const data = JSON.parse(e.data);
    switch (data.action) {
      case 'message':
        if (data.message.user === 'other') {
          data.message.user = username;
        }
        dispatch({
          type: 'addMessage',
          message: data.message,
        });
        break;
      case 'initFileTransfer':
        RNFS_Functions.getDetails({
          name: data.message.name,
          size: data.message.size,
          path: data.message.path,
          sendMessage,
        });
        break;
      case 'startTransfer':
        RNFS_Functions.readFileStream({
          path: data.message.path,
          name: data.message.filename,
          size: data.message.size,
          sendMessage,
          position: data.message.position,
          dispatch,
        });
        break;
      case 'chunk':
        const {base64, name, position, path, size} = data.message;
        RNFS_Functions.writeFileStream({base64, name}).then(() => {
          dispatch({
            type: 'updateProgress',
            name,
            position,
            size,
          });
          const message = {
            action: 'startTransfer',
            message: {filename: name, path, position: position + 150000, size},
          };
          sendMessage(message);
        });
        break;
      case 'errorTransfer':
        break;
      case 'offer':
        InCallManager.startRingtone('_BUNDLE_');

        dispatch({
          type: 'isReceivingCall',
          offer: data.message.offer,
        });
        if (data.message.isVoiceCall) {
          WebRTCFunctions.prepareToAnswerCall({
            pcCall,
            dispatch,
            isVoiceCall: true,
          });
          dispatch({
            type: 'startVoiceCall',
          });
        } else {
          WebRTCFunctions.prepareToAnswerCall({
            pcCall,
            dispatch,
            isVoiceCall: false,
          });

          dispatch({
            type: 'startCall',
          });
        }
        break;
      case 'answer':
        startTimer();
        InCallManager.stopRingback();
        WebRTCFunctions.receiveAnswer({pcCall, answer: data.message});
        dispatch({
          type: 'receiveAnswer',
        });
        break;
      case 'endCall':
        dispatch({
          type: 'endCall',
        });
        pcCall.current?._unregisterEvents();
        pcCall.current?.close();
        break;
      case 'receiverDetails':
        dispatch({
          type: 'addUserDetails',
          chatname: data.message.name,
          img: data.message.uri,
        });
        break;
      case 'videoOn':
        dispatch({
          type: 'videoOn',
        });
        break;
      case 'videoOff':
        dispatch({
          type: 'videoOff',
        });
        break;
      case 'newIce':
        if (state.answered) {
          pcCall.current.addIceCandidate(new RTCIceCandidate(data.message));
        } else {
          dispatch({
            type: 'newIce',
            ice: data.message,
          });
        }
        break;
      case 'newIceAns':
        pcCall.current.addIceCandidate(new RTCIceCandidate(data.message));
        break;
    }
  }

  function sendMessage(message) {
    if (message.action === 'message') {
      dispatch({
        type: 'addMessage',
        message: message.message,
      });
    }
    sendChannel.current.send(JSON.stringify(message));
  }

  const startVideoCallWrapper = () => {
    InCallManager.start({media: 'video'});
    WebRTCFunctions.startCall({
      pcCall,
      dispatch,
      sendMessage,
      isVoiceCall: false,
    });
  };
  const startVoiceCallWrapper = () => {
    InCallManager.start({media: 'audio'});
    WebRTCFunctions.startCall({
      pcCall,
      dispatch,
      sendMessage,
      isVoiceCall: true,
    });
  };

  const startTimer = () => {
    setTime('00:00:00');

    let sec = 0;
    BackgroundTimer.runBackgroundTimer(() => {
      sec += 1;
      let hours = Math.floor(sec / 3600);
      let minutes = Math.floor(sec / 60);
      let seconds = sec % 60;
      minutes = String(minutes).padStart(2, '0');
      hours = String(hours).padStart(2, '0');
      seconds = String(seconds).padStart(2, '0');
      let timeString = hours + ':' + minutes + ':' + seconds;
      setTime(timeString);
    }, 1000);
  };

  const answerCall = isVoiceCall => {
    startTimer();

    InCallManager.stopRingtone();

    InCallManager.start({media: isVoiceCall ? 'audio' : 'video'});
    dispatch({type: 'answeredCall'});
    WebRTCFunctions.answerCall({
      pcCall,
      sendMessage,

      offer: state.offer,
      offerCandidates: state.offerCandidates,
    });
  };

  const endCall = async () => {
    const channelDoc = firestore().collection('Channels').doc(username);
    channelDoc.get().then(d => {
      if (d.exists) {
        channelDoc.delete();
      }
    });
    dispatch({
      type: 'endCall',
    });
    sendChannel.current.close();
    pc.current._unregisterEvents();
    pc.current.close();
  };

  return state.isCalling ? (
    <CallScreen {...{state, pcCall, answerCall, dispatch, sendMessage, time}} />
  ) : state.waiting ? (
    <WaitingScreen {...{endCall, status: state.status, otheruser}} />
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' && 'padding'}
      style={styles.container}>
      <StatusBar {...{backgroundColor: 'transparent', translucent: true}} />
      <ChatHead
        {...{state}}
        startVideoCallWrapper={startVideoCallWrapper}
        endCall={endCall}
        dispatch={dispatch}
        startVoiceCallWrapper={startVoiceCallWrapper}
      />
      <SafeAreaView style={styles.container}>
        <ChatBody dispatch={dispatch} messages={state.messages} />
        <ChatBottom sendMessage={sendMessage} dispatch={dispatch} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bgMain},
});
