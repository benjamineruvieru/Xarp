import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const World = ({child, socket, remoteStream, data, uid, localStream}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const offset = useSharedValue({x: 0, y: 0});
  const start = useSharedValue({x: 0, y: 0});

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .averageTouches(true)

    .onUpdate(e => {
      offset.value = {
        x: e.translationX / scale.value + start.value.x,
        y: e.translationY / scale.value + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: offset.value.x},
      {translateY: offset.value.y},
    ],
  }));

  const composed = Gesture.Simultaneous(
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  const Children = child;
  return (
    <GestureDetector gesture={composed}>
      <View style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Children
            data={data}
            socket={socket}
            scale={scale}
            remoteStream={remoteStream}
            uid={uid}
            localStream={localStream}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default World;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    paddingTop: 70,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
