import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icons, {IconsType} from '../../components/Icons';
import Colors from '../../constants/Colors';
import Text from '../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainSvg from '../../assets/svg/main.svg';
import {SCREEN_WIDTH} from '../../constants/Variables';
import {Modalize} from 'react-native-modalize';
import {
  getPercentHeight,
  userNameExists,
  writeUsername,
  UploadPhoto,
} from '../../utilis/Functions';
import {useNavigation} from '@react-navigation/native';
import {deleteItem, getItem, setItem} from '../../utilis/storage';
import DropdownAlert from 'react-native-dropdownalert';
import firestore from '@react-native-firebase/firestore';
import {useMMKVString} from 'react-native-mmkv';

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
        style={{top: -2}}
      />

      <Text size={'title'}>Xarp Spaces</Text>
      <View />
    </View>
  );
};

const Settings = ({Notify, closeSheet}) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState(getItem('username'));
  const [password, setPassword] = useState(null);
  const [pic, setPic] = useState({filename: 'Select Picture'});
  const [load, setLoad] = useState(false);

  const validateUsername = async () => {
    if (username) {
      const exists = await userNameExists(username);
      if (exists) {
        Notify(
          'error',
          'Username not available',
          'Please enter a new username',
        );
      } else {
        writeUsername(username);
        setItem('username', username);
        closeSheet();
        setUsername();
        Notify(
          'success',
          'Username saved successfully',
          'You can now share your username with others to allow them connect to your chat',
        );
      }
    }
  };
  const validatePassword = () => {
    if (password) {
      setItem('password', password);
      setPassword();
    } else {
      deleteItem('password');
      Notify(
        'success',
        'Password cleared',
        'Users would be able to join your chat without a password',
      );
    }
  };

  const saveProfile = () => {
    if (pic?.uri) {
      const callBack = url => {
        setLoad(false);
        setItem('profilepic', url);
        setPic({filename: 'Select Picture'});
      };
      setLoad(true);
      UploadPhoto(pic.uri, callBack, username);
    }
  };
  const openGallery = () => {
    navigation.navigate('Gallery', {
      allowMultiple: false,
      imageOnly: true,
    });
    DeviceEventEmitter.addListener('receiveMedia', eventData => {
      setPic(eventData.media[0]);
      DeviceEventEmitter.removeAllListeners('receiveMedia');
    });
  };
  return (
    <View style={{padding: 20}}>
      <Text style={{marginBottom: 10}}>Change Username</Text>
      <View style={styles.optionRow}>
        <TextInput
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor={Colors.grey}
          style={styles.horiinput}
        />
        <TouchableOpacity
          onPress={validateUsername}
          style={{alignSelf: 'center', ...styles.smallbutton}}>
          <Text size={'small'}>Save</Text>
        </TouchableOpacity>
      </View>
      <Text style={{marginBottom: 10}}>Change Password</Text>
      <View style={styles.optionRow}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password (Optional)"
          placeholderTextColor={Colors.grey}
          style={styles.horiinput}
        />
        <TouchableOpacity
          onPress={validatePassword}
          style={{alignSelf: 'center', ...styles.smallbutton}}>
          <Text size={'small'}>{password ? 'Save' : 'Clear Password'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={{marginBottom: 10}}>Change Profile Pic</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          onPress={openGallery}
          style={{
            height: 45,
            paddingHorizontal: 15,
            flex: 0.65,
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <Text color={Colors.grey}>{pic.filename}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveProfile}
          style={{alignSelf: 'center', ...styles.smallbutton}}>
          {load ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text size={'small'}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const JoinSpace = ({Notify, closeJoinSheet, openSheet}) => {
  const navigation = useNavigation();
  const [text, setText] = useState();
  const [password, setPassword] = useState();
  const [userStore, setUserStore] = useState();
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);

  const [username] = useMMKVString('username');

  const checkIfUserExists = async user => {
    const channelDoc = firestore().collection('Channels').doc(user);
    const data = await channelDoc.get();

    return {data: data.data(), exists: data.exists};
  };

  const join = async () => {
    const {data, exists} = await checkIfUserExists(text);

    if (exists) {
      if (data?.password) {
        setUserStore(text);
        setPassword(data.password);
        setLoad(false);
        setText();
      } else {
        if (username) {
          setLoad(false);
          navigation.replace('ChatScreen', {user: text});
        } else {
          setLoad(false);
          closeJoinSheet();
          Notify(
            'error',
            'No username selected',
            'Please enter a username before joining a chat',
          );
          setTimeout(openSheet, 500);
        }
      }
    } else {
      Notify(
        'error',
        'Chat does not exist',
        'Please check the username properly',
      );
      setLoad(false);
    }
  };

  const validate = () => {
    if (text) {
      setLoad(true);
      if (password) {
        if (password === text) {
          navigation.replace('ChatScreen', {user: userStore});
        } else {
          Notify('error', 'Incorrect Password', 'Please check the password');
        }
        setLoad(false);
      } else {
        if (text != username) {
          join();
        } else {
          setLoad(false);
        }
      }
    }
  };

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const joinRandom = () => {
    setLoad2(true);
    const ranchannelDoc = firestore().collection('Random').doc('users');

    ranchannelDoc.get().then(async data => {
      if (data.exists) {
        const {users} = data.data();
        if (users.length > 0) {
          const rndInt = randomIntFromInterval(0, users.length - 1);
          const ranusername = users[rndInt];

          const {exists} = await checkIfUserExists(ranusername);
          if (exists) {
            ranchannelDoc
              .update({
                users: firestore.FieldValue.arrayRemove(ranusername),
              })
              .then(() => {
                navigation.replace('ChatScreen', {user: ranusername});
              });
          } else {
            ranchannelDoc
              .update({
                users: firestore.FieldValue.arrayRemove(ranusername),
              })
              .then(() => {
                joinRandom();
              });
          }
        } else {
          Notify(
            'error',
            'No avaliable chats spaces to join',
            'Please try again later or start a random chat space',
          );
          setLoad2(false);
        }
      } else {
        Notify(
          'error',
          'No avaliable chats spaces to join',
          'Please try again later or start a random chat space',
        );
        setLoad2(false);
      }
    });
  };
  return (
    <View style={{padding: 20}}>
      <Text style={{marginBottom: 20}}>
        {password ? 'Enter Password' : 'Enter Username'}
      </Text>
      <TextInput
        onChangeText={setText}
        value={text}
        placeholder={password ? 'Password' : 'Username'}
        placeholderTextColor={Colors.grey}
        style={styles.input}
      />
      <TouchableOpacity
        disabled={load}
        onPress={validate}
        style={{alignSelf: 'center', ...styles.button}}>
        {load ? <ActivityIndicator color={'white'} /> : <Text>Join Chat</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={load2}
        onPress={joinRandom}
        style={{
          ...styles.button,
          alignSelf: 'center',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.primary,
        }}>
        {load2 ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text>Join A Random Chat</Text>
        )}
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
  const closeJoinSheet = () => {
    modalizeRefJoin.current?.close();
  };
  const openJoinSheet = () => {
    modalizeRefJoin.current?.open();
  };

  const closeSheet = () => {
    modalizeRef.current?.close();
  };

  const validate = () => {
    const username = getItem('username');

    if (username) {
      navigation.replace('ChatScreen', {user: ''});
    } else {
      Notify(
        'error',
        'No username selected',
        'Please enter a username before starting a chat',
      );
      setTimeout(openSheet, 500);
    }
  };

  const insets = useSafeAreaInsets();
  let dropDownAlertRef = useRef(null);
  const Notify = (type, title, message) => {
    dropDownAlertRef.alertWithType(type, title, message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Top openSheet={openSheet} />
      <View
        style={{justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
        <MainSvg width={SCREEN_WIDTH / 1.5} height={SCREEN_WIDTH / 1.5} />
        <View />
        <View style={{width: '100%', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button} onPress={validate}>
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
        <Settings closeSheet={closeSheet} Notify={Notify} />
      </Modalize>
      <Modalize
        handleStyle={{backgroundColor: 'white'}}
        handlePosition="inside"
        modalStyle={styles.sheet}
        ref={modalizeRefJoin}
        modalHeight={getPercentHeight(55)}>
        <JoinSpace
          Notify={Notify}
          openSheet={openSheet}
          closeJoinSheet={closeJoinSheet}
        />
      </Modalize>
      <DropdownAlert
        zIndex={1000}
        updateStatusBar={false}
        defaultContainer={{
          flexDirection: 'row',
          paddingVertical: 10,
          paddingHorizontal: 12,
          margin: 10,
          marginTop: 5 + insets.top,
          borderRadius: 15,
        }}
        messageStyle={{
          fontFamily: 'Poppins-Regular',
          color: 'white',
          fontSize: 14,
        }}
        titleStyle={{fontFamily: 'Poppins-Medium', color: 'white'}}
        imageStyle={{height: 25, width: 25, alignSelf: 'center'}}
        ref={ref => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
      />
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
