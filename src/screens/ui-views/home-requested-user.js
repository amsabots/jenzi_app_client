import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Caption} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import {FONTS, SIZES} from '../../constants/themes';
//components
import {LoaderSpinner} from '../../components';
//redux
import {useDispatch, connect} from 'react-redux';
//components
import MIcons from 'react-native-vector-icons/MaterialIcons';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const requests = [
  {
    requestId: 'efe78ed87af872fb67',
    sourceAddress: 'andrewmwebi',
    destinationAddress: 'lameckowesi',
    filterType: 'fundi_requested',
    payload: {
      jobTitle: 'Account opening and configuration',
    },
  },
];

const PendingRequestsView = ({timer, show, cancel, fundis}) => {
  const {selected_fundi} = fundis;
  return (
    show && (
      <View style={styles.container}>
        <Caption>Contacting {selected_fundi.name}</Caption>
        <View style={styles._item_wrapper}>
          <LoaderSpinner.DoubleRing loading={true} />
          <Text style={{marginLeft: SIZES.base, ...FONTS.body_medium}}>
            {timer} / 60
          </Text>
          <Text style={{marginHorizontal: SIZES.base, ...FONTS.body_medium}}>
            Waiting for response....
          </Text>
          <MIcons name="cancel" size={SIZES.padding_32} onPress={cancel} />
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.padding_16,
    width: '100%',
  },
  _item_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export const PendingRequests = connect(mapStateToProps)(PendingRequestsView);
