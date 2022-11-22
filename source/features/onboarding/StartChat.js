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
        size={20}
        fun={openSheet}
      />

      <Text size={'title'}>Xarp Spaces</Text>
      <View />
    </View>
  );
};

const Settings = () => {
  const navigation = useNavigation();
  const [text, setText] = useState();
  const navToMeeting = () => {
    navigation.replace('ChatScreen', {username: text});
  };
  return (
    <View style={{padding: 20}}>
      <Text style={{marginBottom: 10}}>Change Username</Text>
      <View style={styles.optionRow}>
        <TextInput
          onChangeText={setText}
          value={text}
          placeholder="Username"
          placeholderTextColor={Colors.grey}
          style={styles.horiinput}
        />
        <TouchableOpacity
          onPress={navToMeeting}
          style={{alignSelf: 'center', ...styles.smallbutton}}>
          <Text size={'small'}>Save</Text>
        </TouchableOpacity>
      </View>
      <Text style={{marginBottom: 10}}>Change Password</Text>
      <View style={styles.optionRow}>
        <TextInput
          onChangeText={setText}
          value={text}
          placeholder="Password"
          placeholderTextColor={Colors.grey}
          style={styles.horiinput}
        />
        <TouchableOpacity
          onPress={navToMeeting}
          style={{alignSelf: 'center', ...styles.smallbutton}}>
          <Text size={'small'}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const JoinSpace = () => {
  const navigation = useNavigation();
  const [text, setText] = useState();
  const navToMeeting = () => {
    navigation.replace('ChatScreen', {username: text});
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{marginBottom: 20}}>Enter Username</Text>
      <TextInput
        onChangeText={setText}
        value={text}
        placeholder="Username"
        placeholderTextColor={Colors.grey}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={navToMeeting}
        style={{alignSelf: 'center', ...styles.button}}>
        <Text>Join Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const StartChat = ({navigation}) => {
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.replace('ChatScreen', {username: ''});
            }}>
            <Text>Start Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openJoinSheet}>
            <Text
              style={{
                textDecorationLine: 'underline',
              }}>
              Join Chat
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

export default StartChat;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bgMain},
  button: {
    backgroundColor: Colors.primary,

    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
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
    marginBottom: 40,
    fontFamily: 'Poppins-Medium',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    color: 'white',
    height: 45,
    paddingHorizontal: 15,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  smallbutton: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    flex: 0.3,
  },
  horiinput: {
    fontFamily: 'Poppins-Medium',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    color: 'white',
    height: 45,
    paddingHorizontal: 15,
    flex: 0.65,
  },
});
