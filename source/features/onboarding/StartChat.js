import {StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Colors from '../../constants/Colors';
import Text from '../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainSvg from '../../assets/svg/main.svg';
import {SCREEN_WIDTH} from '../../constants/Variables';
import {Modalize} from 'react-native-modalize';
import {getPercentHeight} from '../../utilis/Functions';
import {getItem, setItem} from '../../utilis/storage';
import DropdownAlert from 'react-native-dropdownalert';
import {Head} from './components/Head';
import {Settings} from './components/Settings';
import {Join} from './components/Join';

const StartChat = ({navigation}) => {
  const modalizeRef = useRef(null);
  const modalizeRefJoin = useRef(null);
  const modalizeRefTerms = useRef(null);

  const insets = useSafeAreaInsets();
  let dropDownAlertRef = useRef(null);

  useEffect(() => {
    if (getItem('hasAgreedToTerms') != 'true') {
      openSheetTerms();
    }
  }, []);
  const openSheetTerms = () => {
    modalizeRefTerms.current?.open();
  };
  const closeTermsSheet = () => {
    modalizeRefTerms.current?.close();
  };
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
        adjustToContentHeight>
        <Join
          Notify={Notify}
          openSheet={openSheet}
          closeJoinSheet={closeJoinSheet}
        />
      </Modalize>
      <Modalize
        onClose={() => {
          if (getItem('hasAgreedToTerms') != 'true') {
            setTimeout(() => {
              openSheetTerms();
            }, 500);
          }
        }}
        handleStyle={{backgroundColor: 'white'}}
        handlePosition="inside"
        modalStyle={styles.sheet}
        ref={modalizeRefTerms}
        modalHeight={getPercentHeight(55)}>
        <View style={{padding: 20}}>
          <Text size={'title'}>
            End User License Agreement (EULA) for Xarp Spaces
          </Text>

          <View
            style={{marginVertical: 10, backgroundColor: Colors.otherDarker}}>
            <Text>
              This End User License Agreement ("Agreement") is a legal agreement
              between you and Xarp Spaces.{'\n'}
              {'\n'}By using the App, you agree to be bound by the terms and
              conditions set forth in this Agreement.
              {'\n'}
              If you do not agree to the terms of this Agreement, do not use the
              App.{'\n'}
              {'\n'}Objectionable Content and Abusive Users{'\n'}
              {'\n'}The App is intended for use by individuals seeking to
              communicate with others for lawful purposes only. You may not use
              the App to transmit, distribute, store, or otherwise make
              available content that is illegal, harmful, threatening, abusive,
              harassing, tortious, defamatory, vulgar, obscene, libelous,
              invasive of another's privacy, hateful, or racially, ethnically,
              or otherwise objectionable.{'\n'}Additionally, you may not use the
              App to harass, threaten, or abuse other users. Any behavior that
              is deemed to be abusive, including but not limited to bullying,
              threatening, and harassment, is strictly prohibited and may result
              in the immediate termination of your account.{'\n'}
              {'\n'}User Responsibility{'\n'}
              {'\n'}You are solely responsible for the content you transmit or
              otherwise make available through the App, including but not
              limited to any text, images, videos, or other materials. You agree
              to indemnify and hold harmless Xarp Spaces and its affiliates from
              any claims, damages, or expenses arising from your use of the App,
              including but not limited to your transmission of any
              objectionable content or abusive behavior.
              {'\n'}
              {'\n'}Proprietary Rights{'\n'}
              {'\n'}The App and its contents are protected by copyright,
              trademark, and other proprietary rights and laws. You agree not to
              modify, rent, lease, loan, sell, distribute, or create derivative
              works based on the App or any portion thereof, in any manner.
              {'\n'}
              {'\n'}Termination{'\n'}
              {'\n'}This Agreement is effective until terminated by either
              party. You may terminate this Agreement at any time by
              discontinuing use of the App. Xarp Spaces may also terminate this
              Agreement at any time and without notice, if in its sole
              discretion, you fail to comply with any term or provision of this
              Agreement.{'\n'}Upon termination, you must destroy all copies of
              the App in your possession.{'\n'}
              {'\n'}Disclaimer of Warranties{'\n'}
              {'\n'}The App is provided on an "as is" and "as available" basis.
              Xarp Spaces makes no representations or warranties of any kind,
              express or implied, as to the operation of the App or the
              information, content, materials, or products included on the App.
              You expressly agree that your use of the App is at your sole risk.
              {'\n'}
              {'\n'}
              Limitation of Liability{'\n'}
              {'\n'}In no event will Xarp Spaces be liable for any damages,
              including without limitation, direct, indirect, incidental,
              special, consequential, or punitive damages, arising out of the
              use or inability to use the App, even if Xarp Spaces has been
              advised of the possibility of such damages.{'\n'}
              {'\n'}General Terms{'\n'}
              {'\n'}This Agreement constitutes the entire agreement between you
              and Xarp Spaces regarding the use of the App. If any provision of
              this Agreement is found to be invalid, the remaining provisions
              shall remain in full force and effect.{'\n'}This Agreement shall
              be governed by the laws of the your of Jurisdiction and the
              parties agree to submit to the exclusive jurisdiction of the
              courts. Contact Information If you have any questions or concerns
              regarding this Agreement, please contact Xarp Spaces at
              xarpspaces@gmail.com.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              marginBottom: 20,
            }}
            onPress={() => {
              setItem('hasAgreedToTerms', 'true');
              closeTermsSheet();
            }}>
            <Text>Accept</Text>
          </TouchableOpacity>
        </View>
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
