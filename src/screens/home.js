import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import {getCurrentLocation} from '../config/current-location';

//bottom sheet
import BottomSheet from '@gorhom/bottom-sheet';

// redux store
import {useDispatch, connect} from 'react-redux';
import {fundiActions, UISettingsActions} from '../store-actions';

//components
import {MapView} from '../components';
import {COLORS, SIZES} from '../constants/themes';

//icons
import Icons from 'react-native-vector-icons/Feather';
import MIcons from 'react-native-vector-icons/MaterialIcons';

//building blocks
import {HomeBottomSheetContent} from './ui-views';
import {ScrollView} from 'react-native-gesture-handler';

// subscribtions
import {mainChannel} from '../pusher';
import Pusher from 'pusher-js/react-native';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const Home = ({navigation, fundis}) => {
  //component state
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [accuracy, setAccuracy] = useState();
  const [altitude, setAlt] = useState();
  const [nearbyFundis, setNearbyFundis] = useState();

  //const refresh
  const [find, setFinder] = useState(0);

  // react dispatch
  const dispatch = useDispatch();

  //   get current map location
  const location = async () => {
    const l = await getCurrentLocation();

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

  // handle clicked user maker on the map
  const handleCalloutClick = f => {
    bottomSheetRef.current.snapTo(2);
    dispatch(fundiActions.set_selected_fundi(f));
  };

  //bottom sheet
  const bottomSheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['35%', '50%', '90%'], []);

  useEffect(() => {
    location();
  }, [find]);

  //run on the first screen render
  useEffect(() => {
    mainChannel.consumeUserInfo();
  }, []);
  // on screen coming back to view
  useFocusEffect(() => {
    console.log('Screen view has been resumed');
  });

  return (
    <View style={[styles.container]}>
      {/* Map container */}
      <View style={styles._map_container}>
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
        <MapView
          coordinates={!latitude || !longitude ? {} : {latitude, longitude}}
          nearbyProviders={nearbyFundis}
          onMarkerClicked={f => handleCalloutClick(f)}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        initialSnapIndex={1}
        snapPoints={snapPoints}>
        <ScrollView>
          <HomeBottomSheetContent />
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _map_container: {
    height: '65%',
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

export default connect(mapStateToProps)(Home);
