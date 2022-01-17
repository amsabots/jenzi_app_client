import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {getCurrentLocation} from '../config/current-location';

// redux store

import {UISettingsActions} from '../store-actions/ui-settings';

const Home = () => {
  //component state
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [accuracy, setAccuracy] = useState();
  const [altitude, setAlt] = useState();

  // react dispatch
  const dispatch = useDispatch();

  //   get current map location
  const location = async () => {
    l = await getCurrentLocation();
    const {
      accuracy: acc,
      altitude: alt,
      latitude: lat,
      longitude: longi,
    } = l.coords;
    setAccuracy(acc);
    setLatitude(lat);
    setAlt(alt);
    setLongitude(longi);
  };

  useEffect(() => {
    location();
    dispatch(
      UISettingsActions.status_bar({
        translucent: true,
        bg_color: 'transparent',
      }),
    );
  }, []);

  return (
    <View>
      <Text>hi</Text>
    </View>
  );
};

styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default Home;
