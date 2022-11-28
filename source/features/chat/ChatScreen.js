import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  DeviceEventEmitter,
  Switch,
} from 'react-native';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import {
  startVideoCall,
  joinChat,
  startChat,
  answerVideoCall,
  receiveAnswer,
  prepareToAnswerCall,
  addToRandomList,
  removeFromRandomList,
} from '../engine/WebRTC_Functions';
import DocumentPicker from 'react-native-document-picker';
import {
  initTransfer,
  readFileStream,
  sendFile,
  writeFileStream,
} from '../engine/RNFS_Functions';
import Colors from '../../constants/Colors';
import SendSvg from '../../assets/svg/send.svg';
import LockSvg from '../../assets/svg/lock.svg';

import Icons, {IconsType} from '../../components/Icons';
import Text from '../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {FlashList} from '@shopify/flash-list';
import {PopDialog} from '../../components/Dialog';
import {useNavigation} from '@react-navigation/native';
import {getItem} from '../../utilis/storage';

import WaitSvg from '../../assets/svg/wait.svg';
import {SCREEN_WIDTH} from '../../constants/Variables';
import firestore from '@react-native-firebase/firestore';
import VideoCall from './VideoCall';

import * as Progress from 'react-native-progress';
import {getPercentWidth} from '../../utilis/Functions';

import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import InCallManager from 'react-native-incall-manager';
import {RTCIceCandidate} from 'react-native-webrtc';

const username = getItem('username');

const Header = ({
  endCall,
  chatname,
  startVideoCallWrapper,
  dispatch,
  img,
  startVoiceCallWrapper,
}) => {
  const inset = useSafeAreaInsets();
  const styles = StyleSheet.create({
    headerview: {
      backgroundColor: Colors.primary,
      width: '100%',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingTop: inset.top + 7,
      paddingBottom: 10,
    },
    profileimg: {
      height: 50,
      width: 50,
      borderRadius: 360,
    },
  });

  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.headerview}>
      <Icons
        type={IconsType.Ionicons}
        color={'white'}
        size={25}
        name={'chevron-back'}
        style={{marginRight: 5}}
        fun={() => setOpen(true)}
      />
      <Image
        resizeMode="cover"
        source={img ? img : require('../../assets/images/profile.png')}
        style={styles.profileimg}
      />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <Text numLines={1} size={'title'}>
          {chatname
            ? chatname[0].toUpperCase() + chatname.substring(1, chatname.length)
            : 'No Name'}
        </Text>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <LockSvg
            style={{
              top: Platform.OS === 'android' ? -1 : 0,
            }}
          />
          <Text size={'small'} color={Colors.faintgrey}>
            Secure Chat
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 5,
        }}>
        <Icons
          type={IconsType.Feather}
          name={'video'}
          size={20}
          color={'white'}
          fun={() => {
            dispatch({
              type: 'startCall',
            });
            startVideoCallWrapper();
          }}
        />
        <Icons
          type={IconsType.Feather}
          name={'phone'}
          size={19}
          color={'white'}
          fun={() => {
            dispatch({
              type: 'startVoiceCall',
            });
            startVoiceCallWrapper();
          }}
        />
      </View>
      <PopDialog
        open={open}
        title={'You Are About To End The Space'}
        message={'Messages cannot be recovered after space has ended!'}
        closeModal={() => setOpen(false)}
        onPress={() => {
          endCall();
          navigation.replace('StartChat');
          setOpen(false);
        }}
      />
    </View>
  );
};

const RenderMessages = props => {
  const styles = StyleSheet.create({
    me: {
      backgroundColor: Colors.primary,
      alignSelf: 'flex-end',
      width: '70%',
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
      paddingBottom: 0,
    },
    other: {
      backgroundColor: Colors.bgLighter,
      width: '70%',
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
      paddingBottom: 0,
    },
    mefile: {
      backgroundColor: Colors.primary,
      alignSelf: 'flex-end',
      width: '70%',
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 10,
      paddingBottom: 0,
    },
    otherfile: {
      backgroundColor: Colors.bgLighter,
      width: '70%',
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 10,
      paddingBottom: 0,
    },
  });

  const openFile = async () => {
    if (username === props.item.user) {
      await FileViewer.open(props.item.extra.senderPath);
    } else {
      await FileViewer.open(props.item.extra.receiverPath);
    }
  };
  return (
    <View style={{paddingHorizontal: 8, paddingTop: 6}}>
      {props.item.type === 'media' ? (
        <TouchableOpacity
          disabled={props.item.extra.progress < 1}
          onPress={openFile}
          style={
            username === props.item.user ? styles.mefile : styles.otherfile
          }>
          <View
            style={{
              backgroundColor:
                username === props.item.user
                  ? Colors.primaryDark
                  : Colors.otherDarker,
              padding: 10,
              borderRadius: 5,
            }}>
            <Text>{props.item.message}</Text>
          </View>
          <Progress.Bar
            progress={props.item.extra.progress}
            width={getPercentWidth(70) - 20}
            color={
              username === props.item.user
                ? Colors.primaryDark
                : Colors.otherDarker
            }
            borderColor={
              username === props.item.user
                ? Colors.primaryDark
                : Colors.otherDarker
            }
            style={{marginVertical: 4}}
          />
          <View
            style={{
              paddingBottom: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text size={'small'}>{props.item.time}</Text>
            <Text size={'small'}>{props.item.extra.filesize}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={username === props.item.user ? styles.me : styles.other}>
          <Text>{props.item.message}</Text>
          <View
            style={{
              paddingBottom: 5,
            }}>
            <Text size={'small'}>{props.item.time}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
const Body = ({messages}) => {
  return (
    <View style={styles.body}>
      <Image
        resizeMode="cover"
        source={require('../../assets/images/background.png')}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0.1,
        }}
      />
      <FlashList
        extraData={messages}
        inverted={true}
        estimatedItemSize={71}
        data={messages}
        renderItem={RenderMessages}
        keyExtractor={(_, i) => i}
      />
    </View>
  );
};

const Message = ({sendMessage, dispatch}) => {
  const navigation = useNavigation();
  const [message, setMessage] = useState();

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'formSheet',
        copyTo: 'cachesDirectory',
      });
      response.map(response => {
        console.log(response);
        const names = response.fileCopyUri.split('/');
        names.pop();
        names.push(response.name);
        const path = names.join('/');
        console.log(path);

        sendFile({
          path: path,
          size: response.size,
          sendMessage,
          name: response.name,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const validateSend = () => {
    if (message) {
      const msg = {
        message,
        user: username,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'message',
      };
      sendMessage({message: msg, action: 'message'});

      setMessage();
    } else {
    }
  };

  const openGallery = () => {
    navigation.navigate('Gallery', {
      allowMultiple: true,
      imageOnly: false,
    });
    DeviceEventEmitter.addListener('receiveMedia', eventData => {
      console.log(eventData.media);
      eventData.media.map(response => {
        if (Platform.OS === 'ios') {
          if (response.mediaType === 'video') {
            RNConvertPhAsset.convertVideoFromUrl({
              url: response.uri,
              convertTo: 'mov',
              quality: 'high',
            }).then(res => {
              RNFS.stat(res.path).then(data => {
                sendFile({
                  path: data.path,
                  size: data.size,
                  sendMessage,
                  name: response.filename,
                });
              });
            });
          } else {
            if (response.size) {
              sendFile({
                path: response.uri,
                size: response.size,
                sendMessage,
                name: response.filename,
              });
            } else {
              CameraRoll.iosGetImageDataById(response.id, false).then(res => {
                sendFile({
                  path: res.node.image.filepath,
                  size: res.node.image.fileSize,
                  sendMessage,
                  name: res.node.image.filename,
                });
              });
            }
          }
        } else {
          RNFS.stat(response.uri).then(res => {
            sendFile({
              path: response.uri,
              size: res.size,
              sendMessage,
              name: response.filename,
            });
          });
        }
      });
      DeviceEventEmitter.removeAllListeners('receiveMedia');
    });
  };

  return (
    <View style={styles.messageview}>
      <View style={styles.inputview}>
        <Icons
          type={IconsType.Entypo}
          name={'attachment'}
          color={Colors.faintgrey}
          size={18}
          style={{marginRight: 10}}
          fun={handleDocumentSelection}
        />
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Message"
          placeholderTextColor={Colors.faintgrey}
          style={styles.messageinput}
        />
        <Icons
          type={IconsType.Octicons}
          name={'image'}
          size={18}
          color={Colors.faintgrey}
          fun={openGallery}
        />
      </View>
      <TouchableOpacity onPress={validateSend} style={styles.sendbutton}>
        <SendSvg height={22} width={22} />
      </TouchableOpacity>
    </View>
  );
};

function reducer(state, action) {
  switch (action.type) {
    case 'change_chatname': {
      return {
        ...state,
        chatname: action.chatname,
      };
    }
    case 'addUserDetails': {
      return {
        ...state,
        chatname: action.chatname,
        img: action.img,
      };
    }
    case 'change_status': {
      return {
        ...state,
        status: action.status,
      };
    }
    case 'stop_waiting': {
      return {
        ...state,
        waiting: false,
      };
    }
    case 'startCall': {
      return {
        ...state,
        isCalling: true,
        isVoiceCall: false,
      };
    }
    case 'startVoiceCall': {
      return {
        ...state,
        isCalling: true,
        isVoiceCall: true,
      };
    }
    case 'addMessage': {
      return {
        ...state,
        messages: [action.message, ...state.messages],
      };
    }
    case 'isReceivingCall': {
      return {
        ...state,
        isReceivingCall: true,
        offer: action.offer,
      };
    }
    case 'answeredCall': {
      return {
        ...state,
        isReceivingCall: false,
        answered: true,
      };
    }
    case 'receiveAnswer': {
      return {
        ...state,

        answered: true,
      };
    }
    case 'endCall': {
      InCallManager.stopRingtone();
      InCallManager.stop();
      state.localStream?.getTracks().map(track => {
        track.stop();
      });

      return {
        ...state,
        isCalling: false,
        answered: false,
        offer: null,
        isReceivingCall: false,
        localStream: null,
        isParticipantVideoOn: true,
      };
    }

    case 'setLocalStream': {
      return {
        ...state,
        localStream: action.localStream,
      };
    }

    case 'videoOn': {
      return {
        ...state,
        isParticipantVideoOn: true,
      };
    }

    case 'videoOff': {
      return {
        ...state,
        isParticipantVideoOn: false,
      };
    }

    case 'newIce': {
      return {
        ...state,
        offerCandidates: [action.ice, ...state.offerCandidates],
      };
    }
    case 'newIceAns': {
      return {
        ...state,
        answerCandidates: [action.ice, ...state.answerCandidates],
      };
    }

    case 'updateProgress': {
      const index = state.messages.findIndex(item => {
        return item.message === action.name;
      });

      if (index > -1) {
        const messages = [...state.messages];
        const olddata = state.messages[index];
        const pos = action.position + 150000;
        const nwprogress = pos >= action.size ? action.size : pos / action.size;
        console.log(nwprogress);
        olddata.extra.progress = nwprogress;
        messages[index] = olddata;
        return {
          ...state,
          messages: [...messages],
        };
      }
    }
  }
  throw Error('Unknown action.');
}

const ChatScreen = ({route, navigation}) => {
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
    offerCandidates: [],
    answerCandidates: [],
  });
  const {user} = route.params;

  const [remoteStream, setRemoteStream] = useState(null);
  const pc = useRef();
  const pcCall = useRef();
  const sendChannel = useRef();

  const endCall = async () => {
    const channelDoc = firestore().collection('Channels').doc(username);
    channelDoc.get().then(d => {
      console.log(d.exists);
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
      case 'initTransfer':
        console.log(data.message);

        initTransfer({
          name: data.message.name,
          size: data.message.size,
          path: data.message.path,
          sendMessage,
        });
        break;
      case 'startTransfer':
        readFileStream({
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

        writeFileStream({base64, name}).then(() => {
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
        console.log(data.message);
        break;
      case 'offer':
        InCallManager.startRingtone('_BUNDLE_');
        dispatch({
          type: 'isReceivingCall',
          offer: data.message.offer,
        });
        if (data.message.isVoiceCall) {
          prepareToAnswerCall({
            pcCall,
            dispatch,
            setRemoteStream,
            isVoiceCall: true,
          });
          dispatch({
            type: 'startVoiceCall',
          });
        } else {
          prepareToAnswerCall({
            pcCall,
            dispatch,
            setRemoteStream,
            isVoiceCall: false,
          });

          dispatch({
            type: 'startCall',
          });
        }
        break;
      case 'answer':
        InCallManager.stopRingback();
        receiveAnswer({pcCall, answer: data.message});
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
        dispatch({
          type: 'newIce',
          ice: data.message,
        });
        break;
      case 'newIceAns':
        console.log('Send pcCall addIce');
        pcCall.current.addIceCandidate(new RTCIceCandidate(data.message));
        dispatch({
          type: 'newIceAns',
          ice: data.message,
        });
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

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'change_chatname',
        chatname: user,
      });
      dispatch({
        type: 'change_status',
        status: 'Establishing Connection...',
      });

      joinChat({pc, handleReceiveMessage, sendChannel, username: user});
    } else {
      dispatch({
        type: 'change_status',
        status: 'Waiting for user to connect...',
      });

      startChat({handleReceiveMessage, pc, sendChannel, username});
    }

    pc.current.onconnectionstatechange = async state => {
      console.log('Connection state', state, pc.current.connectionState);
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
        setTimeout(() => {
          sendMessage(message);
        }, 500);
      } else if (pc.current.connectionState === 'connecting') {
        dispatch({
          type: 'change_status',
          status: 'Connecting...',
        });
      }
    };
  }, []);

  const startVideoCallWrapper = () => {
    InCallManager.start({media: 'video'});
    startVideoCall({
      pcCall,
      dispatch,
      setRemoteStream,
      sendMessage,
      isVoiceCall: false,
    });
  };
  const startVoiceCallWrapper = () => {
    InCallManager.start({media: 'audio'});
    startVideoCall({
      pcCall,
      dispatch,
      setRemoteStream,
      sendMessage,
      isVoiceCall: true,
    });
  };
  const answerCall = isVoiceCall => {
    InCallManager.stopRingtone();

    InCallManager.start({media: isVoiceCall ? 'audio' : 'video'});
    dispatch({type: 'answeredCall'});
    answerVideoCall({
      pcCall,
      sendMessage,

      offer: state.offer,
      offerCandidates: state.offerCandidates,
    });
  };

  const inset = useSafeAreaInsets();

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => {
      if (!previousState) {
        addToRandomList({username});
      } else {
        removeFromRandomList({username});
      }
      return !previousState;
    });
  };

  return (
    <>
      {state.isCalling ? (
        <VideoCall
          pcCall={pcCall}
          isParticipantVideoOn={state.isParticipantVideoOn}
          answerCall={answerCall}
          dispatch={dispatch}
          img={state.img}
          localStream={state.localStream}
          chatname={state.chatname}
          isVoiceCall={state.isVoiceCall}
          sendMessage={sendMessage}
          remoteStream={remoteStream}
          isReceivingCall={state.isReceivingCall}
          answered={state.answered}
        />
      ) : (
        <>
          {state.waiting ? (
            <View
              style={{
                ...styles.container,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: inset.top + 30,

                  zIndex: 2,

                  left: 0,
                  right: 0,
                  paddingHorizontal: 30,
                }}>
                <Icons
                  type={IconsType.AntDesign}
                  name={'close'}
                  size={28}
                  color={'white'}
                  fun={() => {
                    endCall();
                    navigation.replace('StartChat');
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}></View>
              <WaitSvg width={SCREEN_WIDTH / 1.5} height={SCREEN_WIDTH / 1.5} />
              <Text>{state.status}</Text>
              <ActivityIndicator color={'white'} style={{marginTop: 10}} />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                {!user && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text size={'small'}>Allow random users to join</Text>
                    <Switch
                      style={{
                        transform: [
                          {
                            scale: 0.7,
                          },
                        ],
                      }}
                      trackColor={{false: '#767577', true: Colors.primary}}
                      thumbColor={'#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <StatusBar backgroundColor={'transparent'} translucent={true} />
              <Header
                img={state.img}
                startVideoCallWrapper={startVideoCallWrapper}
                chatname={state.chatname}
                endCall={endCall}
                dispatch={dispatch}
                startVoiceCallWrapper={startVoiceCallWrapper}
              />
              <SafeAreaView style={styles.container}>
                <Body messages={state.messages} />
                <Message sendMessage={sendMessage} dispatch={dispatch} />
              </SafeAreaView>
            </KeyboardAvoidingView>
          )}
        </>
      )}
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bgMain},

  body: {
    flex: 1,
    paddingBottom: 6,
  },

  messageview: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  sendbutton: {
    backgroundColor: Colors.primary,
    height: 50,
    width: 50,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageinput: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    marginRight: 5,
  },
  inputview: {
    flex: 1,
    backgroundColor: Colors.bgLighter,
    height: 50,
    borderRadius: 360,
    marginRight: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
