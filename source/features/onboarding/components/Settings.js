import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import React, {useState} from 'react';
import Text from '../../../components/Text';
import {
  userNameExists,
  writeUsername,
  UploadPhoto,
  deleteUsername,
} from '../../../utilis/Functions';
import {useNavigation} from '@react-navigation/native';
import {deleteItem, getItem, setItem} from '../../../utilis/storage';
import Colors from '../../../constants/Colors';

export const Settings = ({Notify, closeSheet}) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState(getItem('username'));
  const [password, setPassword] = useState(null);
  const [pic, setPic] = useState({filename: 'Select Picture'});
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);

  const validateUsername = async () => {
    if (username) {
      setLoad2(true);
      const exists = await userNameExists(username);
      if (exists) {
        Notify(
          'error',
          'Username not available',
          'Please enter a new username',
        );
        setLoad2(false);
      } else {
        if (getItem('username')) {
          deleteUsername(getItem('username'));
        }
        writeUsername(username);
        setItem('username', username);
        closeSheet();
        setUsername();
        Notify(
          'success',
          'Username saved successfully',
          'You can now share your username with others to allow them connect to your chat',
        );
        setLoad2(false);
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
          disabled={load2}
          onPress={validateUsername}
          style={{alignSelf: 'center', ...styles.smallbutton}}>
          {load2 ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text size={'small'}>Save</Text>
          )}
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

const styles = StyleSheet.create({
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
