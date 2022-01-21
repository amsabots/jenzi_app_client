import React, {useState, useEffect} from 'react';

import {Button} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
import {CircularImage, ReviewContainer} from '.';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {connect} from 'react-redux';

//components
import {LoadingNothing} from '.';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const DetailsView = ({leadinglabel = 'No details available', fundis}) => {
  const {selected_fundi: fundi} = fundis;

  return Object.keys(fundi).length ? (
    <View style={styles.container}>
      <CircularImage size={100} />
      {/*  */}
      <View style={styles._details}>
        <Text style={{...FONTS.body_bold, marginBottom: SIZES.base}}>
          {fundi.name}
        </Text>
        <Button mode="contained" style={{backgroundColor: COLORS.primary}}>
          Send a message
        </Button>
      </View>
      {/*  */}
      <View style={{marginVertical: SIZES.padding_16}}>
        <Button mode="contained" style={{backgroundColor: COLORS.secondary}}>
          request service
        </Button>
      </View>
      {/*  */}

      <View style={styles._reviews}>
        <ReviewContainer />
      </View>
    </View>
  ) : (
    <LoadingNothing label={leadinglabel} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SIZES.padding_12,
  },
  _details: {
    marginVertical: SIZES.base,
  },
  _reviews: {
    width: '100%',
  },
});

export const FundiDetails = connect(mapStateToProps)(DetailsView);
