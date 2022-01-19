import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';

const InfoChips = ({textColor, text}) => {
  const bgColor = textColor + 40;
  return (
    <View style={[styles.chip_container, {backgroundColor: bgColor}]}>
      <Text style={{color: textColor, ...FONTS.body_medium}}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip_container: {
    paddingVertical: 4,
    paddingHorizontal: SIZES.base,
    alignSelf: 'baseline',
  },
});

export {InfoChips};
