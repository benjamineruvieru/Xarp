import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import FilterSvg from './icons/Filter';
import SoundSvg from './icons/Sound';
import StickerSvg from './icons/Stickers';
import TextSvg from './icons/Text';
import AdjustSvg from './icons/Adjust';
import PauseSvg from './icons/Pause';
import Icons, {IconsType} from '../../../components/Icons';

export const CameraControlBtn = props => {
  const {name, icon} = props;
  return (
    <TouchableOpacity onPress={() => props.touchFunc()}>
      <View style={styles.camControls}>
        {icon === 'filter' ? (
          <FilterSvg />
        ) : icon === 'sound' ? (
          <SoundSvg />
        ) : icon === 'text' ? (
          <TextSvg />
        ) : icon === 'adjust' ? (
          <AdjustSvg />
        ) : icon === 'flip' ? (
          <Icons
            type={IconsType.Ionicons}
            name={'camera-reverse-outline'}
            size={30}
            color="#fff"
          />
        ) : (
          <StickerSvg />
        )}
        <Text
          style={{
            color: '#fff',
            fontSize: 10,
            marginTop: 5,
          }}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const RecordButton = ({
  recordVideo,
  isCamReady,
  stopVideo,
  isRecording,
  pauseVideo,
  resumeVideo,
}) => {
  const scale = useRef(new Animated.Value(60)).current;
  const [isPlaying, setisPlaying] = useState(false);

  useEffect(() => {
    if (!isRecording) {
      stopRecording();
    }
  }, [isRecording]);

  const stopRecording = () => {
    Animated.spring(scale, {
      toValue: 60,
      useNativeDriver: false,
    }).start();
    setisPlaying(false);
  };
  const toggleButton = () => {
    if (!isRecording) {
      Animated.spring(scale, {
        toValue: 80,
        useNativeDriver: false,
      }).start();
      recordVideo();
      setisPlaying(true);
    } else {
      if (isPlaying) {
        setisPlaying(false);
        pauseVideo();
      } else {
        setisPlaying(true);
        resumeVideo();
      }
    }
  };

  const styles = StyleSheet.create({
    animatedstyle: {
      width: scale,
      height: scale,
      borderRadius: 360,
      backgroundColor: !isRecording ? 'transparent' : '#FFEDFF',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    recordBtn: {
      width: 60,
      height: 60,
      borderRadius: 30,

      alignSelf: 'center',
    },
    recordBtnStroke: {
      borderColor: isRecording ? 'transparent' : 'rgba(249, 74, 64, 0.8)',
      borderWidth: 3,
      borderRadius: 360,
      padding: 4,
    },
  });

  return (
    <Pressable
      onPress={() => {
        toggleButton();
      }}

      // onLongPress={() => recordVideo()}
      // disabled={!isCamReady}
      // onPressOut={() => }
    >
      <View style={styles.recordBtnStroke}>
        <Animated.View style={styles.animatedstyle}>
          {isRecording ? (
            isPlaying ? (
              <PauseSvg />
            ) : (
              <Icons
                type={IconsType.Ionicons}
                name={'play'}
                size={30}
                color="#F94A3F"
              />
            )
          ) : (
            <LinearGradient
              colors={['#F94A3F', '#e4317d']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.recordBtn}
            />
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

export const StopRecordButton = ({stopVideo}) => {
  return (
    <TouchableOpacity
      onPress={stopVideo}
      style={{
        backgroundColor: '#FFEDFF',
        width: 35,
        height: 35,
        borderRadius: 360,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icons
        type={IconsType.Entypo}
        name={'controller-stop'}
        size={25}
        color="#F94A3F"
      />
    </TouchableOpacity>
  );
};

export const SavePostButton = ({recordVideo, isCamReady, stopVideo}) => {
  return (
    <LinearGradient
      colors={['#F94A3F', '#e4317d']}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
      style={{
        width: 35,
        height: 35,
        borderRadius: 360,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icons type={IconsType.Feather} name={'check'} size={20} color="#fff" />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  galleryBtn: {
    alignItems: 'center',
  },
  effectsBtn: {
    alignItems: 'center',
  },

  camControls: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  galleryImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  effectsImg: {
    width: 40,
    height: 40,
  },
});
