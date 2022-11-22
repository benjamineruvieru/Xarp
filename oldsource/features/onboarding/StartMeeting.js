import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icons, {IconsType} from '../../components/Icons';
import Colors from '../../constants/Colors';
import Text from '../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainSvg from '../../assets/svg/main.svg';
import {SCREEN_WIDTH} from '../../constants/Variables';
import {Modalize} from 'react-native-modalize';
import {getPercentHeight} from '../../utilis/Functions';
import {useNavigation} from '@react-navigation/native';

const Top = ({openSheet}) => {
  const inset = useSafeAreaInsets();
  const styles = StyleSheet.create({
    topcontainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      position: 'absolute',
      top: inset.top,
      left: 0,
      right: 0,
      height: 70,
      zIndex: 1,
    },
  });
  return (
    <View style={styles.topcontainer}>
      <Icons
        type={IconsType.Feather}
        name={'settings'}
        color={'white'}
        size={22}
        fun={openSheet}
      />

      <Text size={'title'}>Xarp Spaces</Text>
      <View />
    </View>
  );
};

const Option = ({text}) => {
  return (
    <View style={styles.option}>
      <Text>{text}</Text>
    </View>
  );
};

const Settings = () => {
  return (
    <View>
      <Option text={'Join with Video'} />
      <Option text={'Join with Audio'} />
      <Option text={'Space Password'} />
    </View>
  );
};

const JoinSpace = () => {
  const navigation = useNavigation();
  const [text, setText] = useState();
  const navToMeeting = () => {
    navigation.replace('HomeScreen', {roomID: text});
  };

  return (
    <View style={{padding: 12}}>
      <Text style={{marginBottom: 20}}>Enter Space ID</Text>
      <TextInput
        onChangeText={setText}
        value={text}
        placeholder="Space ID"
        placeholderTextColor={Colors.grey}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={navToMeeting}
        style={{alignSelf: 'center', ...styles.button, padding: 15}}>
        <Text>Join Space</Text>
      </TouchableOpacity>
    </View>
  );
};

const StartMeeting = () => {
  const modalizeRef = useRef(null);
  const modalizeRefJoin = useRef(null);
  const openSheet = () => {
    modalizeRef.current?.open();
  };
  const closeSheet = () => {
    modalizeRef.current?.close();
  };
  const openJoinSheet = () => {
    modalizeRefJoin.current?.open();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Top openSheet={openSheet} />
      <View
        style={{justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
        <MainSvg width={SCREEN_WIDTH / 1.5} height={SCREEN_WIDTH / 1.5} />
        <View />
        <View style={{width: '100%', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button}>
            <Text>Start Space</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openJoinSheet}>
            <Text
              style={{
                textDecorationLine: 'underline',
              }}>
              Join Space
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modalize
        handleStyle={{backgroundColor: 'white'}}
        handlePosition="inside"
        modalStyle={styles.sheet}
        ref={modalizeRef}
        modalHeight={getPercentHeight(55)}>
        <Settings />
      </Modalize>
      <Modalize
        handleStyle={{backgroundColor: 'white'}}
        handlePosition="inside"
        modalStyle={styles.sheet}
        ref={modalizeRefJoin}
        modalHeight={getPercentHeight(55)}>
        <JoinSpace />
      </Modalize>
    </SafeAreaView>
  );
};

export default StartMeeting;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bgMain},
  button: {
    backgroundColor: Colors.primary,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  sheet: {
    backgroundColor: Colors.bgLighter,
    paddingTop: 10,
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    padding: 15,
    marginBottom: 40,
    fontFamily: 'Poppins-Medium',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    color: 'white',
  },
});
