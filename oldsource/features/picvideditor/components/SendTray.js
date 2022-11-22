import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icons, {IconsType} from '../../../components/Icons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants/Variables';
import Colors from '../../../constants/Colors';
import RoundButton from '../../../components/RoundButton';
import ImagePicker from 'react-native-image-crop-picker';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
const SendTray = ({type, path, thumbList, replacePath, index, duration}) => {
  const sendFun = () => {};

  const crop = () => {
    ImagePicker.openCropper({
      path: path,
      freeStyleCropEnabled: true,
    }).then(image => {
      replacePath(image.path, index);
    });
  };

  const startL = useSharedValue(0);
  const startR = useSharedValue(0);

  const xL = useSharedValue(0);
  const xR = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {})
    .onUpdate(e => {
      if (
        e.translationX + startL.value > 0 &&
        e.translationX + startL.value < SCREEN_WIDTH / 2 - 120 / 2 - 30
      ) {
        xL.value = e.translationX + startL.value;
      }
    })
    .onEnd(() => {
      startL.value = xL.value;
    })
    .onFinalize(() => {});

  const gestureRight = Gesture.Pan()
    .onBegin(() => {})
    .onUpdate(e => {
      //console.log(e.translationX + startR.value);
      if (
        e.translationX + startR.value < 0 &&
        e.translationX + startR.value > -(SCREEN_WIDTH / 2 - 120 / 2) + 30
      ) {
        xR.value = e.translationX + startR.value;
      }
    })
    .onEnd(() => {
      startR.value = xR.value;
    })
    .onFinalize(() => {});

  const animatedStylesLeft = useAnimatedStyle(() => {
    return {
      transform: [{translateX: xL.value}],
    };
  });

  const animatedStylesRight = useAnimatedStyle(() => {
    return {
      transform: [{translateX: xR.value}],
    };
  });

  return (
    <View style={styles.container}>
      {type === 'video' ? (
        <View style={styles.thumbSliderThumbs}>
          <View
            style={{
              zIndex: 1,
              overflow: 'hidden',
              height: 50,
              width: SCREEN_WIDTH / 2 - 120 / 2,
              position: 'absolute',
              left: 0,
            }}>
            <GestureDetector gesture={gesture}>
              <Animated.View style={[animatedStylesLeft, styles.leftSlider]} />
            </GestureDetector>
          </View>
          <View
            style={{
              zIndex: 1,
              overflow: 'hidden',
              height: 50,
              width: SCREEN_WIDTH / 2 - 120 / 2,
              position: 'absolute',
              left: 0,
            }}>
            <GestureDetector gesture={gestureRight}>
              <Animated.View
                style={[animatedStylesRight, styles.rightSlider]}
              />
            </GestureDetector>
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
  leftSlider: {
    position: 'absolute',
    left: 0,
    height: 50,
    width: SCREEN_WIDTH / 2 - 120 / 2,

    zIndex: 2,
    borderWidth: 2,
    borderColor: 'white',
    borderRightWidth: 0,
  },
  rightSlider: {
    position: 'absolute',
    left: 0,
    height: 50,
    width: SCREEN_WIDTH / 2 - 120 / 2,

    zIndex: 1,
    borderWidth: 2,
    borderColor: 'red',
    borderLeftWidth: 0,
  },
});
