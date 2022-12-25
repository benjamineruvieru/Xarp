import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {PermissionsAndroid, Platform, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Colors from './source/constants/Colors';
import StackNav from './source/navigation/StackNav';
import firestore from '@react-native-firebase/firestore';
import RNBootSplash from 'react-native-bootsplash';
import RNFS from 'react-native-fs';

firestore().settings({
  persistence: false,
});
StatusBar.setBarStyle('light-content');

Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.bgMain);

RNBootSplash.hide({fade: true});
if (Platform.OS === 'ios') {
  RNFS.mkdir(RNFS.DocumentDirectoryPath + '/Received Files', {
    NSURLIsExcludedFromBackupKey: false,
  });
} else {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ).then(granted => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      RNFS.mkdir(
        RNFS.ExternalStorageDirectoryPath + '/Xarp Spaces/Received Files',
      );
    }
  });
}
const App = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{flex: 1}}>
        <StackNav />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
