import React from 'react';

import {View, StyleSheet, Text} from 'react-native';
import {LoaderSpinner} from '.';
import {COLORS, FONTS, SIZES} from '../constants/themes';

const LoadingNothing = ({label, textColor = COLORS.secondary}) => {
  return (
    <View>
      <View style={styles.container}>
        <LoaderSpinner.MainScreen
          loading={true}
          height={SIZES.device.height / 3}
          width={SIZES.device.width / 1.3}
        />
      </View>
      {label && (
        <Text
          style={{
            ...FONTS.body1,
            marginVertical: SIZES.padding_16,
            textAlign: 'center',
            color: textColor,
          }}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export {LoadingNothing};
