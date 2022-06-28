import React, {useState, useEffect, memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Caption} from 'react-native-paper';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
//components
import {LoaderSpinner} from '../../components';
//redux
import {useDispatch, connect} from 'react-redux';
import {store} from '../../../App';
//components
import MIcons from 'react-native-vector-icons/MaterialIcons';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const PendingRequestsView = memo(({onCancel, fundis}) => {
  const {sent_requests, selected_fundi} = fundis;
  return sent_requests.length ? (
    <View>
      <Text style={{...FONTS.body_medium, color: COLORS.secondary}}>
        Contacting Fundi
      </Text>
      {sent_requests.map((el, idx) => {
        return (
          <View style={styles.container} key={idx}>
            <Caption>
              Contacting{' '}
              <Text style={{fontWeight: 'bold'}}>
                {selected_fundi.name || 'Not Available'}
              </Text>
            </Caption>
            <View style={styles._item_wrapper}>
              <LoaderSpinner.DoubleRing loading={true} />
              <Text style={{...FONTS.body_medium, marginRight: SIZES.base}}>
                Waiting for fundi response....
              </Text>
              <MIcons
                name="cancel"
                size={SIZES.padding_32}
                onPress={() => onCancel(el)}
                color={COLORS.secondary}
              />
            </View>
          </View>
        );
      })}
    </View>
  ) : null;
});

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
