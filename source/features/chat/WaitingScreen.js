import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Icons, {IconsType} from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_WIDTH} from '../../constants/Variables';
import WaitSvg from '../../assets/svg/wait.svg';
import Text from '../../components/Text';
import WebRTCFunctions from '../engine/WebRTC_Functions';
import {getItem} from '../../utilis/storage';

const WaitingScreen = ({endCall, status, otheruser}) => {
  const username = getItem('username');

  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => {
      if (!previousState) {
        WebRTCFunctions.addToRandomList({username});
      } else {
        WebRTCFunctions.removeFromRandomList({username});
      }
      return !previousState;
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cancel, {top: inset.top + 30}]}>
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
      <Text>{status}</Text>
      <ActivityIndicator color={'white'} style={{marginTop: 10}} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        {false && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text size={'small'}>Allow random users join</Text>
            <Switch
              style={styles.switch}
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
  );
};

export default WaitingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    position: 'absolute',

    zIndex: 2,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
  },
  switch: {
    transform: [
      {
        scale: 0.7,
      },
    ],
  },
});
