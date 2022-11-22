import {StyleSheet} from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import StartChat from '../features/onboarding/StartChat';
import ChatScreen from '../features/chat/ChatScreen';
const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName={'StartChat'}
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="StartChat" component={StartChat} />
    </Stack.Navigator>
  );
};

export default StackNav;

const styles = StyleSheet.create({});
