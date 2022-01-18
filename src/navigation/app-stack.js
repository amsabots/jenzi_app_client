import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {HomeView, Projects} from '../screens';
import {screens} from '../constants/screens';
const Drawer = createDrawerNavigator();

// components
import {CustomDrawer} from '../components/custom-drawer';
//icons
import AntIcons from 'react-native-vector-icons/AntDesign';
import F5 from 'react-native-vector-icons/FontAwesome';
import {COLORS, SIZES} from '../constants/themes';

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={screens.home}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.light_secondary,
        drawerActiveTintColor: COLORS.secondary,
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name={screens.home}
        component={HomeView}
        options={{
          drawerIcon: ({color}) => (
            <AntIcons name="home" size={SIZES.icon_size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={screens.projects}
        component={Projects}
        options={{
          drawerIcon: ({color}) => (
            <F5 name="tasks" size={SIZES.icon_size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawerNavigator;
