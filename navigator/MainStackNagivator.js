import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import Home from '../Screens/Home';
import FeaturedRecipes from '../Screens/FeaturedRecipes';
import Profile from '../Screens/Profile';


const Stack = createNativeStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="FeaturedRecipes"
      component={FeaturedRecipes}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default MainStackNavigator;