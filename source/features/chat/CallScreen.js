import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Platform,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RTCView} from 'react-native-webrtc';
import Colors from '../../constants/Colors';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Variables';
import Text from '../../components/Text';
import Icons, {IconsType} from '../../components/Icons';
import RoundButton from '../../components/RoundButton';
import LockSvg from '../../assets/svg/lock.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getPercentWidth} from '../../utilis/Functions';
import InCallManager from 'react-native-incall-manager';

import SpeakerSvg from '../../assets/svg/speaker.svg';
import SpeakerOffSvg from '../../assets/svg/speakerOff.svg';

const CallScreen = ({
  localStream,
  chatname,
  img,
  isVoiceCall,
  dispatch,
  sendMessage,
  isReceivingCall,
  answerCall,
  remoteStream,
  answered,
  isParticipantVideoOn,
  pcCall,
  time,
}) => {
  const [videoOn, setVideoOn] = useState(!isVoiceCall);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMainView, setisMainView] = useState(true);
  const switchCam = async () => {
    try {
      const videoTrack = await localStream.getVideoTracks()[0];
      videoTrack._switchCamera();
    } catch (err) {}
  };

  const toggleVideo = () => {
    try {
      localStream.getVideoTracks().map(track => (track.enabled = !videoOn));

      setVideoOn(prev => {
        if (prev) {
          sendMessage({
            action: 'videoOff',
          });
        } else {
          sendMessage({
            action: 'videoOn',
          });
        }
        return !prev;
      });
    } catch (err) {}
  };

  const toggleAudio = async () => {
    try {
      localStream.getAudioTracks().forEach(track => (track.enabled = isMuted));
      setIsMuted(prev => !prev);
    } catch (err) {
      // Handle Error
    }
  };

  const toggleSpeaker = async () => {
    try {
      InCallManager.setForceSpeakerphoneOn(!isSpeakerOn);
      setIsSpeakerOn(prev => !prev);
    } catch (err) {
      // Handle Error
    }
  };

  useEffect(() => {
    if (answered) {
      if (isVoiceCall) {
      } else {
        setisMainView(false);
      }
    }
  }, [answered]);

  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    stream: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    container: {flex: 1, backgroundColor: Colors.bgMain},
    tray: {
      backgroundColor: '#29324350',
      left: 15,
      right: 15,
      position: 'absolute',
      bottom: 50,
      padding: 15,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    top: {
      alignSelf: 'center',
      marginTop: 30 + StatusBar.currentHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileimg: {
      height: 70,
      width: 70,
      borderRadius: 360,
      marginTop: 20,
      marginBottom: 10,
    },
    floatingVideo: {
      height: getPercentWidth(35) + 70,
      width: getPercentWidth(35),
      position: 'absolute',
      right: 10,
      top: insets.top + 20,
      borderRadius: 10,
      overflow: 'hidden',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />

      {isVoiceCall ? (
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
      ) : answered ? (
        isMainView ? (
          videoOn ? (
            <RTCView
              streamURL={
                !isMainView ? remoteStream?.toURL() : localStream?.toURL()
              }
              style={styles.stream}
              objectFit="cover"
            />
          ) : (
            <Image
              resizeMode="contain"
              source={require('../../assets/images/profile.png')}
              style={{
                position: 'absolute',
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
              }}
            />
          )
        ) : isParticipantVideoOn ? (
          <RTCView
            streamURL={
              !isMainView ? remoteStream?.toURL() : localStream?.toURL()
            }
            style={styles.stream}
            objectFit="cover"
          />
        ) : (
          <Image
            resizeMode="contain"
            source={require('../../assets/images/profile.png')}
            style={{
              position: 'absolute',
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            }}
          />
        )
      ) : videoOn ? (
        <RTCView
          streamURL={!isMainView ? remoteStream?.toURL() : localStream?.toURL()}
          style={styles.stream}
          objectFit="cover"
        />
      ) : (
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
      )}

      {isVoiceCall ? (
        <View style={styles.top}>
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
              Secure Call
            </Text>
          </View>
          <Image
            resizeMode="cover"
            source={img ? img : require('../../assets/images/profile.png')}
            style={styles.profileimg}
          />
          <Text
            style={{
              fontSize: 27,
              marginBottom: 10,
            }}>
            {chatname
              ? chatname[0].toUpperCase() +
                chatname.substring(1, chatname.length)
              : 'No Name'}
          </Text>
          <Text
            style={{
              fontSize: 12,
            }}>
            {answered ? time : 'Calling'}
          </Text>
        </View>
      ) : (
        !answered && (
          <View style={styles.top}>
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
                Secure Call
              </Text>
            </View>
            <Image
              resizeMode="cover"
              source={img ? img : require('../../assets/images/profile.png')}
              style={styles.profileimg}
            />
            <Text
              style={{
                fontSize: 27,
                marginBottom: 10,
              }}>
              {chatname
                ? chatname[0].toUpperCase() +
                  chatname.substring(1, chatname.length)
                : 'No Name'}
            </Text>
            <Text
              style={{
                fontSize: 12,
              }}>
              Calling
            </Text>
          </View>
        )
      )}
      <View style={styles.tray}>
        {isReceivingCall && (
          <RoundButton
            fun={() => {
              answerCall(isVoiceCall);
            }}
            color={'green'}>
            <Icons
              type={IconsType.MaterialCommunityIcons}
              name={'phone'}
              size={22}
              color={'white'}
            />
          </RoundButton>
        )}
        {!isVoiceCall && !isReceivingCall && (
          <RoundButton fun={switchCam} color={Colors.grey}>
            <Icons
              type={IconsType.Ionicons}
              name={'camera-reverse-outline'}
              size={24}
              color={'white'}
            />
          </RoundButton>
        )}
        {isVoiceCall && !isReceivingCall && (
          //Speaker Loud
          <RoundButton fun={toggleSpeaker} color={Colors.grey}>
            {isSpeakerOn ? <SpeakerSvg /> : <SpeakerOffSvg />}
          </RoundButton>
        )}

        {!isVoiceCall && (
          <RoundButton fun={toggleVideo} color={Colors.grey}>
            <Icons
              type={IconsType.Feather}
              name={videoOn ? 'camera' : 'camera-off'}
              size={20}
              color={'white'}
            />
          </RoundButton>
        )}

        <RoundButton fun={toggleAudio} color={Colors.grey}>
          <Icons
            type={IconsType.FontAwesome}
            name={isMuted ? 'microphone-slash' : 'microphone'}
            size={20}
            color={'white'}
          />
        </RoundButton>

        <RoundButton
          fun={() => {
            sendMessage({
              action: 'endCall',
            });
            dispatch({
              type: 'endCall',
            });
            pcCall?.current?._unregisterEvents();
            pcCall?.current?.close();
          }}
          color={Colors.red}>
          <Icons
            type={IconsType.MaterialCommunityIcons}
            name={'phone-hangup'}
            size={22}
            color={'white'}
          />
        </RoundButton>
      </View>

      {!isVoiceCall && answered && (
        <Pressable
          onPress={() => {
            setisMainView(prev => !prev);
          }}
          style={styles.floatingVideo}>
          {!isMainView ? (
            videoOn ? (
              <RTCView
                zOrder={1}
                streamURL={
                  !isMainView ? localStream?.toURL() : remoteStream?.toURL()
                }
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 10,
                }}
                objectFit="cover"
              />
            ) : (
              <Image
                resizeMode="contain"
                source={require('../../assets/images/profile.png')}
                style={{
                  //  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#BABABA',
                }}
              />
            )
          ) : isParticipantVideoOn ? (
            <RTCView
              zOrder={1}
              streamURL={
                !isMainView ? localStream?.toURL() : remoteStream?.toURL()
              }
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 10,
              }}
              objectFit="cover"
            />
          ) : (
            <Image
              resizeMode="contain"
              source={require('../../assets/images/profile.png')}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#BABABA',
              }}
            />
          )}
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default CallScreen;
