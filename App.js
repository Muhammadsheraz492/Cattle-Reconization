import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './screens/signup';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import LiveDetection from './screens/video';
import AutoLivedetection from './screens/autolive';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login"
      screenOptions={{
        headerShown:false
      }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="homescreen" component={HomeScreen} />
        <Stack.Screen name="livedetection" component={LiveDetection} />
        <Stack.Screen name="autolivedetection" component={AutoLivedetection} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
