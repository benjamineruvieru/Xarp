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
import SpeakerSvg from '../../assets/svg/speaker.svg';
import SpeakerOffSvg from '../../assets/svg/speakerOff.svg';
import CallFunctions from './functions';

const profileimg = require('../../assets/images/profile.png');
const bg = require('../../assets/images/background.png');

const CallMainView = ({
  videoOn,
  isMainView,
  isParticipantVideoOn,
  localStream,
  remoteStream,
  isVoiceCall,
  answered,
}) => {
  const showPlaceholder =
    (!videoOn && isMainView) || (!isParticipantVideoOn && !isMainView);

  const streamURL = isMainView ? localStream?.toURL() : remoteStream?.toURL();

  return (
    <>
      {isVoiceCall && (
        <Image resizeMode="cover" source={bg} style={styles.backgroundImage} />
      )}
      {answered && !isVoiceCall ? (
        showPlaceholder ? (
          <Image
            resizeMode="contain"
            source={profileimg}
            style={styles.profileImage}
          />
        ) : (
          <RTCView
            streamURL={streamURL}
            style={styles.stream}
            objectFit="cover"
          />
        )
      ) : (
        videoOn &&
        !isVoiceCall && (
          <RTCView
            streamURL={localStream?.toURL()}
            style={StyleSheet.absoluteFillObject}
            objectFit="cover"
          />
        )
      )}
    </>
  );
};

const CallTopInfo = ({isVoiceCall, chatname, answered, time, img}) => {
  return isVoiceCall ? (
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
        source={img ? img : profileimg}
        style={styles.profileimg}
      />
      <Text
        style={{
          fontSize: 27,
          marginBottom: 10,
        }}>
        {chatname
          ? chatname[0].toUpperCase() + chatname.substring(1, chatname.length)
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
            ? chatname[0].toUpperCase() + chatname.substring(1, chatname.length)
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
  );
};

const FloatingVideo = ({
  isVoiceCall,
  answered,
  setisMainView,
  isMainView,
  videoOn,
  localStream,
  remoteStream,
  isParticipantVideoOn,
}) => {
  const toggleMainView = () => {
    setisMainView(prev => !prev);
  };
  const insets = useSafeAreaInsets();

  const showPlaceholder =
    (!videoOn && !isMainView) || (!isParticipantVideoOn && isMainView);

  const streamURL = !isMainView ? localStream?.toURL() : remoteStream?.toURL();

  return (
    !isVoiceCall &&
    answered && (
      <Pressable
        onPress={toggleMainView}
        style={[styles.floatingVideo, {top: insets.top + 20}]}>
        {showPlaceholder ? (
          <Image
            resizeMode="contain"
            source={profileimg}
            style={styles.videoPlaceholder}
          />
        ) : (
          <RTCView
            zOrder={1}
            streamURL={streamURL}
            style={styles.videoStream}
            objectFit="cover"
          />
        )}
      </Pressable>
    )
  );
};

const BottomTray = ({
  pcCall,
  isReceivingCall,
  answerCall,
  isVoiceCall,
  switchCam,
  toggleSpeaker,
  toggleVideo,
  isSpeakerOn,
  isMuted,
  videoOn,
  toggleAudio,
  dispatch,
  sendMessage,
}) => {
  return (
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
  );
};

const CallScreen = ({
  dispatch,
  sendMessage,
  answerCall,
  pcCall,
  time,
  state,
}) => {
  const {
    chatname,
    isParticipantVideoOn,
    remoteStream,
    answered,
    isReceivingCall,
    isVoiceCall,
    localStream,
    img,
  } = state ?? {};
  const [videoOn, setVideoOn] = useState(!isVoiceCall);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMainView, setisMainView] = useState(true);

  const callFunctions = CallFunctions({
    localStream,
    setVideoOn,
    isMuted,
    sendMessage,
    videoOn,
    setIsMuted,
    setIsSpeakerOn,
  });

  const {toggleAudio, toggleVideo, switchCam, toggleSpeaker} = callFunctions;

  useEffect(() => {
    if (answered && !isVoiceCall) {
      setisMainView(false);
    }
  }, [answered]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <CallMainView
        {...{
          isMainView,
          isParticipantVideoOn,
          isVoiceCall,
          localStream,
          remoteStream,
          videoOn,
          answered,
        }}
      />

      <CallTopInfo {...{answered, chatname, isVoiceCall, img, time}} />
      <BottomTray
        {...{
          answerCall,
          isMuted,
          isReceivingCall,
          isSpeakerOn,
          isVoiceCall,
          pcCall,
          switchCam,
          toggleSpeaker,
          toggleVideo,
          videoOn,
          toggleAudio,
          dispatch,
          sendMessage,
        }}
      />

      <FloatingVideo
        {...{
          answered,
          isMainView,
          isParticipantVideoOn,
          isVoiceCall,
          localStream,
          remoteStream,
          setisMainView,
          videoOn,
        }}
      />
    </SafeAreaView>
  );
};

export default CallScreen;

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

    borderRadius: 10,
    overflow: 'hidden',
  },
  videoStream: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#BABABA',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  profileImage: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
