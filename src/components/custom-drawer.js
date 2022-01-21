import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import {} from 'react-native-paper';
//sub components
import {NavHeader} from './sub-components';

//
import {appTheme, theme} from '../constants';
import {COLORS} from '../constants/themes';

const CustomDrawer = props => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[styles.drawer_conatiner]}>
        <NavHeader navigation={props.navigation} />
        <View style={[styles.list_item, {backgroundColor: theme.COLORS.white}]}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* bottom text */}
      <View>
        <Text>Bottom text</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer_conatiner: {
    flex: 1,
  },
  list_item: {
    flex: 1,
  },
});

export {CustomDrawer};
