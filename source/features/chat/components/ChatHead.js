import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icons, {IconsType} from '../../../components/Icons';
import LockSvg from '../../../assets/svg/lock.svg';
import {CustomDialog, PopDialog} from '../../../components/Dialog';
import Colors from '../../../constants/Colors';
import Text from '../../../components/Text';
import {getItem, setItem} from '../../../utilis/storage';

const SecureChat = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <LockSvg
        style={{
          top: Platform.OS === 'android' ? -1 : 0,
        }}
      />
      <Text size={'small'} color={Colors.faintgrey}>
        Secure Chat
      </Text>
    </View>
  );
};

export const ChatHead = ({
  endCall,
  chatname,
  startVideoCallWrapper,
  dispatch,
  img,
  startVoiceCallWrapper,
}) => {
  const inset = useSafeAreaInsets();
  const styles = StyleSheet.create({
    headerview: {
      backgroundColor: Colors.primary,
      width: '100%',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingTop: inset.top + 7,
      paddingBottom: 10,
    },
    profileimg: {
      height: 50,
      width: 50,
      borderRadius: 360,
    },
  });

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const navigation = useNavigation();
  return (
    <View style={styles.headerview}>
      <Icons
        type={IconsType.Ionicons}
        color={'white'}
        size={25}
        name={'chevron-back'}
        style={{marginRight: 5}}
        fun={() => setOpen(true)}
      />
      <TouchableOpacity onPress={() => setOpen2(true)}>
        <Image
          resizeMode="cover"
          source={img ? img : require('../../../assets/images/profile.png')}
          style={styles.profileimg}
        />
      </TouchableOpacity>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <Text numLines={1} size={'title'}>
          {chatname
            ? chatname[0].toUpperCase() + chatname.substring(1, chatname.length)
            : 'No Name'}
        </Text>
        <SecureChat />
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 5,
        }}>
        <Icons
          type={IconsType.Feather}
          name={'video'}
          size={20}
          color={'white'}
          fun={() => {
            dispatch({
              type: 'startCall',
            });
            startVideoCallWrapper();
          }}
        />
        <Icons
          type={IconsType.Feather}
          name={'phone'}
          size={19}
          color={'white'}
          fun={() => {
            dispatch({
              type: 'startVoiceCall',
            });
            startVoiceCallWrapper();
          }}
        />
      </View>
      <PopDialog
        open={open}
        title={'You Are About To End The Space'}
        message={'Messages cannot be recovered after space has ended!'}
        closeModal={() => setOpen(false)}
        onPress={() => {
          endCall();
          navigation.replace('StartChat');
          setOpen(false);
        }}
      />
      <CustomDialog
        title={'Block this user'}
        message={'You will no longer be able to connect with this user again'}
        open={open2}
        closeModal={() => setOpen2(false)}
        button={'Block'}
        onPress={() => {
          const blockedList = getItem('blockedList', true);
          blockedList.push(chatname);
          console.log(blockedList);
          setItem('blockedList', blockedList, true);
          endCall();
          navigation.replace('StartChat');
          setOpen2(false);
        }}
      />
    </View>
  );
};
