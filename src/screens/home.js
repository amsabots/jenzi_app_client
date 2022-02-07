import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import {getCurrentLocation} from '../config/current-location';

//bottom sheet
import BottomSheet from '@gorhom/bottom-sheet';
import {Banner} from 'react-native-paper';

// redux store
import {useDispatch, connect} from 'react-redux';
import {
  fundiActions,
  UISettingsActions,
  user_data_actions,
} from '../store-actions';

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
  const {fundis, user_data} = state;
  return {fundis, user_data};
};

const Home = ({navigation, fundis, user_data}) => {
  //component state
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [bannerVisible, setBannerVisible] = useState(false);

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
    setLatitude(lat);
    setLongitude(longi);

    //update coordinates
    if (lat && longi)
      dispatch(user_data_actions.update_coordinates(lat, longi));
  };

  // handle clicked user maker on the map
  const handleCalloutClick = useCallback(f => {
    bottomSheetRef.current.snapTo(2);
    dispatch(fundiActions.set_selected_fundi(f));
  });

  //bottom sheet
  const bottomSheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['35%', '50%', '90%'], []);

  useEffect(() => {
    location();
  }, [find]);

  //run on the first screen render
  useEffect(() => {
    mainChannel.consumeUserInfo(user_data.user.clientId);
  }, []);
  // on screen coming back to view
  useFocusEffect(() => {
    //do something when you navigati back to this screen
  });

  return (
    <View style={[styles.container]}>
      {/* Map container */}
      <View style={styles._map_container}>
        <View style={[styles._hamburger, styles._fab_container]}>
          <MIcons
            name="menu"
            size={SIZES.icon_size}
            color={COLORS.primary}
            onPress={() => navigation.openDrawer()}
          />
        </View>
        {/* banner section to display state of fundis */}
        {fundis.fundis.length < 1 && (
          <Banner style={{top: 64}} visible={bannerVisible} actions={[]}>
            There are no available fundis within your location.
          </Banner>
        )}
        {/* ============================= */}
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
          nearbyProviders={fundis.fundis}
          onMarkerClicked={f => handleCalloutClick(f)}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        initialSnapIndex={1}
        snapPoints={snapPoints}>
        <ScrollView>
          <HomeBottomSheetContent
            bottomSheetTop={() => bottomSheetRef.current.snapTo(2)}
          />
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
