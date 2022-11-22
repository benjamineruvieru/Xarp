import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RoundButton from '../../components/RoundButton';
import Colors from '../../constants/Colors';
import Icons, {IconsType} from '../../components/Icons';
import {getPercentHeight} from '../../../source/utilis/Functions';
import LocalDirectory from './components/LocalDirectory';
import MediaRoll from './components/MediaRoll';
import {useNavigation} from '@react-navigation/native';
const Bottom = () => {
  const [open, setOpen] = useState({open: false, type: null});
  const transY = useSharedValue(getPercentHeight(40) + 20);
  const navigation = useNavigation();
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: transY.value}],
    };
  });
  const toogleSheet = type => {
    if (open.open) {
      if (open.type === type) {
        transY.value = withTiming(getPercentHeight(40) + 20, {
          easing: Easing.inOut(Easing.exp),
          duration: 300,
        });

        setOpen({
          open: false,
          type: null,
        });
      } else {
        setOpen({
          open: type,
          type: type,
        });
      }
    } else {
      transY.value = withTiming(0, {
        easing: Easing.inOut(Easing.exp),
        duration: 500,
      });
      setOpen({
        open: true,
        type: type,
      });
    }
  };

  const folderFun = () => {
    toogleSheet('folder');
  };
  const mediaFun = () => {
    toogleSheet('media');
  };
  const cameraFun = () => {
    navigation.navigate('CameraScreen');
  };
  const shareFun = () => {};

  const micFun = () => {};

  return (
    <Animated.View style={[styles.bottomcontainer, animatedStyles]}>
      <View style={styles.top}>
        <RoundButton fun={folderFun} color={Colors.grey}>
          <Icons
            type={IconsType.Feather}
            name={'file'}
            color={Colors.faintgrey}
          />
        </RoundButton>
        <RoundButton fun={mediaFun} color={Colors.grey}>
          <Icons
            type={IconsType.Octicons}
            name={'image'}
            color={Colors.faintgrey}
          />
        </RoundButton>

        <RoundButton fun={cameraFun} color={Colors.grey}>
          <Icons
            type={IconsType.Feather}
            name={'camera'}
            color={Colors.faintgrey}
          />
        </RoundButton>
        <RoundButton fun={shareFun} color={Colors.grey}>
          <Icons
            type={IconsType.Octicons}
            name={'share'}
            color={Colors.faintgrey}
          />
        </RoundButton>
        <RoundButton fun={micFun} color={Colors.primary}>
          <Icons
            type={IconsType.FontAwesome}
            name={'microphone'}
            color={'white'}
          />
        </RoundButton>
      </View>
      <View style={styles.bottom}>
        {open.open && open.type === 'folder' ? (
          <LocalDirectory />
        ) : open.type === 'media' ? (
          <MediaRoll />
        ) : null}
      </View>
    </Animated.View>
  );
};

export default Bottom;

const styles = StyleSheet.create({
  bottomcontainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    backgroundColor: Colors.bgLighter,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottom: {
    height: getPercentHeight(40),
    marginTop: 20,
  },
});
