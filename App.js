import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Colors from './source/constants/Colors';
import StackNav from './source/navigation/StackNav';
import firestore from '@react-native-firebase/firestore';
import RNBootSplash from 'react-native-bootsplash';
import {requestExternalStoragePermission} from './source/utilis/Functions';

firestore().settings({
  persistence: false,
});

StatusBar.setBarStyle('light-content');

if (Platform.OS === 'android') {
  StatusBar.setBackgroundColor(Colors.bgMain);
}

RNBootSplash.hide({fade: true});

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
