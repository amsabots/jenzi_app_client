import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Caption} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
//components
import {LoaderSpinner} from '../../components';
//redux
import {useDispatch, connect} from 'react-redux';
//components
import MIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {fundiActions} from '../../store-actions';

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
  console.log(fundis.sent_requests);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get('http://3.129.148.239:27500/realtime-server/notify/andrewmwebi')
      .then(res => {
        dispatch(fundiActions.get_all_Sent_requests(res.data));
      })
      .catch(err => console.log(err));
  }, []);

  const {selected_fundi, sent_requests} = fundis;
  return sent_requests.length ? (
    <View>
      <Text>Sent requests</Text>
      {sent_requests.map((el, idx) => {
        return (
          <View style={styles.container} key={idx}>
            <Caption>Contacting {el.destinationAddress}</Caption>
            <View style={styles._item_wrapper}>
              <LoaderSpinner.DoubleRing loading={true} />
              <Text style={{...FONTS.body_medium}}>
                Waiting for response....
              </Text>
              <MIcons
                name="cancel"
                size={SIZES.padding_32}
                onPress={cancel}
                color={COLORS.secondary}
              />
            </View>
          </View>
        );
      })}
    </View>
  ) : null;
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
