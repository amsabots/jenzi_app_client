import React from 'react';

import AuthNavigator from './auth-stack';
import AppDrawerNavigator from './app-stack';
import {screens} from '../constants';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//redux
import {useDispatch, connect} from 'react-redux';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const Stack = createNativeStackNavigator();

const NavigationContainerWrapperView = ({user_data}) => {
  const user_exists = () => {
    return Object.keys(user_data.user).length > 0;
  };
  console.log(user_exists());
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          user_exists() ? screens.stack_app : screens.stack_auth
        }
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={screens.stack_app} component={AppDrawerNavigator} />
        <Stack.Screen name={screens.stack_auth} component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const NavigationContainerWrapper = connect(mapStateToProps)(
  NavigationContainerWrapperView,
);
