import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {LogBox, PermissionsAndroid, Platform, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Colors from './source/constants/Colors';
import StackNav from './source/navigation/StackNav';
import firestore from '@react-native-firebase/firestore';
import RNBootSplash from 'react-native-bootsplash';
import RNFS from 'react-native-fs';

// Initialize Firestore settings
firestore().settings({
  persistence: false,
});

// Set the status bar style
StatusBar.setBarStyle('light-content');

// Set the status bar background color for Android
if (Platform.OS === 'android') {
  StatusBar.setBackgroundColor(Colors.bgMain);
}

// Hide the splash screen
RNBootSplash.hide({fade: true});

if (Platform.OS === 'ios') {
  try {
    RNFS.mkdir(RNFS.DocumentDirectoryPath + '/Received Files', {
      NSURLIsExcludedFromBackupKey: false,
    });
  } catch (error) {
    console.error('Error creating dir IOS:', error);
  }
}

// Request permission to write external storage and create necessary directories
const requestExternalStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNFS.mkdir(
          RNFS.ExternalStorageDirectoryPath + '/Xarp Spaces/Received Files',
        );
      }
    } catch (error) {
      console.error('Error requesting external storage permission:', error);
    }
  }
};

const App = () => {
  useEffect(() => {
    requestExternalStoragePermission();
  }, []);
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{flex: 1}}>
        <StackNav />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
