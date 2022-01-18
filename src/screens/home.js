import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {getCurrentLocation} from '../config/current-location';

//bottom sheet
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

// redux store
import {UISettingsActions} from '../store-actions/ui-settings';

//components
import {MapView} from '../components';
import {COLORS, SIZES} from '../constants/themes';

//icons
import Icons from 'react-native-vector-icons/Feather';
import MIcons from 'react-native-vector-icons/MaterialIcons';

//building blocks
import {HomeBottomSheetContent} from './ui-views';

const Home = ({navigation}) => {
  //component state
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [accuracy, setAccuracy] = useState();
  const [altitude, setAlt] = useState();

  //const refresh
  const [find, setFinder] = useState(0);

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
  }, [find]);

  useEffect(() => {
    dispatch(
      UISettingsActions.status_bar({
        translucent: true,
        bg_color: 'transparent',
      }),
    );
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={[styles._hamburger, styles._fab_container]}>
        <Icons
          name="menu"
          size={SIZES.icon_size_focused}
          onPress={() => navigation.openDrawer()}
          color={COLORS.primary}
        />
      </View>
      <View style={[styles._returnTocurrentPosition, styles._fab_container]}>
        <MIcons
          name="my-location"
          size={SIZES.icon_size}
          color={COLORS.primary}
          onPress={() => setFinder(s => s + 1)}
        />
      </View>
      {/* <MapView
        coordinates={!latitude || !longitude ? {} : {latitude, longitude}}
      /> */}
      <BottomSheet
        snapPoints={[500, 300, 0]}
        initialSnap={1}
        borderRadius={10}
        renderContent={HomeBottomSheetContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _hamburger: {
    top: SIZES.padding_32,
    left: SIZES.icon_size,
  },
  _fab_container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.white,
    zIndex: 10,
    height: 48,
    width: 48,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 1.5,
    elevation: 4,
  },
  _returnTocurrentPosition: {
    bottom: SIZES.padding_32,
    right: SIZES.icon_size,
  },
});

export default Home;
