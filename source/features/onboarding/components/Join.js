import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Text from '../../../components/Text';

import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useMMKVString} from 'react-native-mmkv';
import {randomIntFromInterval} from '../../../utilis/Functions';
import Colors from '../../../constants/Colors';

const checkIfUserExists = async user => {
  const channelDoc = firestore().collection('Channels').doc(user);
  const data = await channelDoc.get();
  return {data: data.data(), exists: data.exists};
};

export const Join = ({Notify, closeJoinSheet, openSheet}) => {
  const navigation = useNavigation();
  const [text, setText] = useState();
  const [password, setPassword] = useState();
  const [userStore, setUserStore] = useState();
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);

  const [username] = useMMKVString('username');

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
          navigation.replace('ChatScreen', {otheruser: text});
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
          navigation.replace('ChatScreen', {otheruser: userStore});
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

  const joinRandom = () => {
    if (username) {
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
                  navigation.replace('ChatScreen', {otheruser: ranusername});
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
    } else {
      closeJoinSheet();
      Notify(
        'error',
        'No username selected',
        'Please enter a username before starting a chat',
      );
      setTimeout(openSheet, 500);
    }
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

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: Colors.primary,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
  },
});
