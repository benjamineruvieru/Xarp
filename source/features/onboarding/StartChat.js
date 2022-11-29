import {StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import Colors from '../../constants/Colors';
import Text from '../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainSvg from '../../assets/svg/main.svg';
import {SCREEN_WIDTH} from '../../constants/Variables';
import {Modalize} from 'react-native-modalize';
import {getPercentHeight} from '../../utilis/Functions';
import {getItem} from '../../utilis/storage';
import DropdownAlert from 'react-native-dropdownalert';
import {Head} from './components/Head';
import {Settings} from './components/Settings';
import {Join} from './components/Join';

const StartChat = ({navigation}) => {
  const modalizeRef = useRef(null);
  const modalizeRefJoin = useRef(null);
  const insets = useSafeAreaInsets();
  let dropDownAlertRef = useRef(null);

  const openSheet = () => {
    modalizeRef.current?.open();
  };
  const closeSheet = () => {
    modalizeRef.current?.close();
  };
  const closeJoinSheet = () => {
    modalizeRefJoin.current?.close();
  };
  const openJoinSheet = () => {
    modalizeRefJoin.current?.open();
  };

  const Notify = (type, title, message) => {
    dropDownAlertRef.alertWithType(type, title, message);
  };

  const validateUser = () => {
    const username = getItem('username');
    if (username) {
      navigation.replace('ChatScreen', {otheruser: ''});
    } else {
      Notify(
        'error',
        'No username selected',
        'Please enter a username before starting a chat',
      );
      setTimeout(openSheet, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Head openSheet={openSheet} />
      <View style={styles.body}>
        <MainSvg width={SCREEN_WIDTH / 1.5} height={SCREEN_WIDTH / 1.5} />
        <View />
        <View style={{width: '100%', alignItems: 'center'}}>
          <TouchableOpacity style={styles.button} onPress={validateUser}>
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
        <Join
          Notify={Notify}
          openSheet={openSheet}
          closeJoinSheet={closeJoinSheet}
        />
      </Modalize>
      <DropdownAlert
        zIndex={1000}
        updateStatusBar={false}
        defaultContainer={{
          ...styles.notiDefault,
          marginTop: 5 + insets.top,
        }}
        messageStyle={styles.notiMessage}
        titleStyle={styles.notiTitle}
        imageStyle={styles.notiImg}
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
  body: {justifyContent: 'space-evenly', alignItems: 'center', flex: 1},
  notiMessage: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: 14,
  },
  notiTitle: {fontFamily: 'Poppins-Medium', color: 'white'},
  notiImg: {height: 25, width: 25, alignSelf: 'center'},
  notiDefault: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 10,
    borderRadius: 15,
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
  sheet: {
    backgroundColor: Colors.bgLighter,
    paddingTop: 10,
  },
});
