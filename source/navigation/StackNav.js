import {StyleSheet} from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import StartChat from '../features/onboarding/StartChat';
import ChatScreen from '../features/chat/ChatScreen';
import Gallery from '../features/media/Gallery';
import SendMedia from '../features/media/SendMedia';

const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator initialRouteName={'StartChat'}>
      <Stack.Group
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="StartChat" component={StartChat} />
        <Stack.Screen name="SendMedia" component={SendMedia} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          header: () => null,
        }}>
        <Stack.Screen name="Gallery" component={Gallery} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNav;
