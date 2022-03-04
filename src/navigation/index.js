import React, {useEffect} from 'react';
//sqlite
import storage from '@react-native-async-storage/async-storage';
import {screens} from '../constants';
import AuthNavigator from './auth-stack';
import AppDrawerNavigator from './app-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//components
import {MainActivity} from '../screens';

const Stack = createNativeStackNavigator();

const NavigationContainerWrapperView = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={screens.main_activity}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={screens.stack_app} component={AppDrawerNavigator} />
        <Stack.Screen name={screens.main_activity} component={MainActivity} />
        <Stack.Screen name={screens.stack_auth} component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const NavigationContainerWrapper = NavigationContainerWrapperView;
