import {StyleSheet, Animated as An, Platform} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {getPercentWidth} from '../../../../source/utilis/Functions';
import {updateComponent} from '../../firebase/actions';

//import {db} from '../../firebase';
import firestore from '@react-native-firebase/firestore';

export const db = firestore();
//const uid = 'testID';

const Dragable = props => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const x = useRef(new An.Value(0)).current;

  const y = useRef(new An.Value(0)).current;
  const {uid} = props;
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {
          scale: props.access.shouldScale
            ? scale.value
            : withSpring(isPressed.value ? 1.2 : 1),
        },
      ],
    };
  });

  const start = useSharedValue({x: 0, y: 0});

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      if (props.access.shouldScale) {
        scale.value = savedScale.value * e.scale;
      }
    })
    .onEnd(() => {
      if (props.access.shouldScale) {
        savedScale.value = scale.value;
      }
    });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (props.access.move.includes(uid) || props.access.move === 'all') {
        isPressed.value = true;
      }
    })
    .onUpdate(e => {
      if (props.access.move.includes(uid) || props.access.move === 'all') {
        offset.value = {
          x: e.translationX / props.scale.value + start.value.x,
          y: e.translationY / props.scale.value + start.value.y,
        };
      }
    })
    .onEnd(() => {
      if (props.access.move.includes(uid) || props.access.move === 'all') {
        start.value = {
          x: offset.value.x,
          y: offset.value.y,
        };
        const upd = {
          position: {
            x: offset.value.x,
            y: offset.value.y,
            uid: Platform.OS,
          },
        };

        runOnJS(updateComponent)({data: upd, id: props.id});
      }
    })
    .onFinalize(() => {
      {
        isPressed.value = false;
      }
    });

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      runOnJS(props.fun)();
    });

  const composed = Gesture.Simultaneous(
    Gesture.Simultaneous(pinchGesture, gesture, singleTap),
  );
  const styles = StyleSheet.create({
    ball: {
      width: getPercentWidth(props.width),
      height: getPercentWidth(props.height),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: props.position.x,
      top: props.position.y,
    },
    balll: {
      transform: [{translateX: x}, {translateY: y}],
    },
  });

  const animateTo = (xv, yv) => {
    An.timing(x, {
      useNativeDriver: true,
      toValue: xv,
    }).start();
    An.timing(y, {
      useNativeDriver: true,
      toValue: yv,
    }).start();
  };

  // useEffect(() => {
  //   const component = db
  //     .collection('Channels')
  //     .doc(uid)
  //     .collection('Components');
  //   component.onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(change => {
  //       if (change.type === 'modified') {
  //         const data = change.doc.data();

  //         if (props.id === change.doc.id && data.position.uid !== Platform.OS) {
  //           animateTo(data.position.x, data.position.y);
  //         }
  //       }
  //     });
  //   });
  // }, []);

  return (
    <An.View style={styles.balll}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.ball, animatedStyles]}>
          {props.children}
        </Animated.View>
      </GestureDetector>
    </An.View>
  );
};

export default Dragable;
