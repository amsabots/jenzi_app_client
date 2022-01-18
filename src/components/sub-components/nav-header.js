import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';

import {Button, useTheme} from 'react-native-paper';
import {theme} from '../../constants';
import {FONTS, SIZES} from '../../constants/themes';
//
import {Chip} from 'react-native-paper';

//
import {CircularImage} from '../circular-image';

const NavHeader = () => {
  const handleProfileOpener = () => {
    console.log('open profile');
  };
  const {colors} = useTheme();
  return (
    <View style={[styles.container]}>
      <CircularImage size={100} />
      <Text style={[styles.color, styles.txt1]}>Andrew Mwebbi</Text>
      {/*  */}
      <Text style={[styles.color, styles._email]}>andymwebi@gmail.com</Text>

      <Button
        mode="contained"
        style={{marginTop: SIZES.padding_16}}
        icon={'face-profile'}
        onPress={() => console.warn('open profile')}>
        Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.SIZES.padding_16,
  },
  color: {},
  txt1: {
    ...FONTS.body_bold,
    marginTop: SIZES.padding_12,
  },
  _info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  _email: {
    ...FONTS.body,
  },
});

export {NavHeader};
