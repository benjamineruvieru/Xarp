import {Image, StyleSheet, DeviceEventEmitter, View} from 'react-native';
import React from 'react';
import Icons, {IconsType} from '../../../components/Icons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants/Variables';
import Colors from '../../../constants/Colors';
import RoundButton from '../../../components/RoundButton';
import ImagePicker from 'react-native-image-crop-picker';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

const SendTray = ({thumbList, progress, type, dispatch, state}) => {
  const navigation = useNavigation();

  const sendFun = () => {
    const mediaList = state.fullList;
    const croppedUri = state.croppedUri;

    const newmediaList = mediaList.map((item, index) => {
      if (croppedUri[index]) {
        return {
          ...item,
          ...croppedUri[index],
        };
      } else {
        return item;
      }
    });

    DeviceEventEmitter.emit('receiveMedia', {media: newmediaList});
    navigation.goBack();
    navigation.goBack();
  };

  const crop = () => {
    ImagePicker.openCropper({
      path: state.uri,
      width: 1000,
      height: 1000,
      freeStyleCropEnabled: true,
    }).then(image => {
      dispatch({
        type: 'crop_image',
        index: state.currentIndex,
        cropUri: image.path,
        size: image.size,
      });
    });
  };

  // const startL = useSharedValue(0);

  // const gesture = Gesture.Pan()
  //   .onBegin(() => {})
  //   .onUpdate(e => {
  //     if (
  //       e.translationX + startL.value > 0 &&
  //       e.translationX + startL.value < SCREEN_WIDTH - 123
  //     ) {
  //       xL.value = e.translationX + startL.value;
  //     }
  //   })
  //   .onEnd(() => {
  //     startL.value = xL.value;
  //   })
  //   .onFinalize(() => {});

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: progress ? progress : 0}],
    };
  });

  return (
    <View style={styles.container}>
      {type === 'video' ? (
        <View style={styles.thumbSliderThumbs}>
          <View
            style={{
              zIndex: 1,
              height: 50,
              width: 5,
              position: 'absolute',
              left: 0,
            }}>
            {/* <GestureDetector gesture={gesture}
            > */}
            <Animated.View style={[animatedStyles, styles.slider]} />
            {/* </GestureDetector> */}
          </View>

          {thumbList &&
            thumbList.map(path => (
              <Image
                key={path}
                source={{uri: path}}
                style={{
                  height: 50,
                  width: (SCREEN_WIDTH - 120) / 7,
                }}
              />
            ))}
        </View>
      ) : (
        <>
          <Icons
            type={IconsType.Entypo}
            name={'crop'}
            color={'white'}
            size={30}
            fun={crop}
          />
        </>
      )}
      <RoundButton fun={sendFun} color={Colors.primary}>
        <Icons type={IconsType.Ionicons} name={'ios-send'} color={'white'} />
      </RoundButton>
    </View>
  );
};

export default SendTray;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SCREEN_HEIGHT - 120,
    width: SCREEN_WIDTH - 50,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbSliderThumbs: {
    flexDirection: 'row',
    height: 50,
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    left: 0,
    height: 50,
    width: 3,

    zIndex: 2,

    backgroundColor: 'white',
  },
});
