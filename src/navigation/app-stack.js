import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {HomeView} from '../screens';
import {screens} from '../constants/screens';
const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={screens.home}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name={screens.home} component={HomeView} />
    </Drawer.Navigator>
  );
};

export default AppDrawerNavigator;
