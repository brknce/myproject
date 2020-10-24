import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Signup">
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}