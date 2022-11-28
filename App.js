import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {LogBox, Platform, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Colors from './source/constants/Colors';
import StackNav from './source/navigation/StackNav';
import firestore from '@react-native-firebase/firestore';
import RNBootSplash from 'react-native-bootsplash';

firestore().settings({
  persistence: false,
});
StatusBar.setBarStyle('light-content');

LogBox.ignoreLogs(['Require cycle: node_modules/rn-fetch-blob/index.js']);

Platform.OS === 'android' && StatusBar.setBackgroundColor(Colors.bgMain);

RNBootSplash.hide({fade: true});
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
