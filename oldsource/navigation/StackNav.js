import {StyleSheet} from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import HomeScreen from '../features/home/HomeScreen';
import CameraScreen from '../features/camera/Camera';
import SendMedia from '../features/picvideditor/SendMedia';
import StartMeeting from '../features/onboarding/StartMeeting';
const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName={'StartMeeting'}
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="StartMeeting" component={StartMeeting} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="SendMedia" component={SendMedia} />
    </Stack.Navigator>
  );
};

export default StackNav;

const styles = StyleSheet.create({});
