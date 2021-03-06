import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet, BackHandler, ToastAndroid} from 'react-native';
import {getCurrentLocation} from '../config/current-location';

//bottom sheet
import BottomSheet from '@gorhom/bottom-sheet';
import {Banner, Snackbar} from 'react-native-paper';

// redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions, user_data_actions} from '../store-actions';

//components
import {MapView, HomeFab} from '../components';
import {COLORS, SIZES} from '../constants/themes';

//icons
import MIcons from 'react-native-vector-icons/MaterialIcons';
import EvilICons from 'react-native-vector-icons/EvilIcons';

//building blocks
import {HomeBottomSheetContent, CurrentProject} from './ui-views';
import {ScrollView} from 'react-native-gesture-handler';

// subscribtions
import {jobUtils} from '../pusher';
import {screens} from '../constants';

const mapStateToProps = state => {
  const {fundis, user_data, ui_settings} = state;
  return {fundis, user_data, ui_settings};
};

const Home = ({navigation, fundis, user_data, ui_settings}) => {
  const {project_banner} = ui_settings;
  //component state
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [bannerVisible, setBannerVisible] = useState(false);
  const [project_banner_visible, setProjectBannerVisibility] = useState(false);
  const [snackbar, setSnackBar] = useState(false);
  const [enforce_fetch, setEnforceFetch] = useState(0);
  const [is_ui_resumed, setUiResumed] = useState(false);

  //const refrproject_banneresh
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
    navigation.navigate(screens.fundi_details_preview, {...f});
  });

  //bottom sheet
  const bottomSheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['55%', '70%'], []);

  // back button Handler
  let backHandlerClickCount = 0;
  const backButtonHandler = () => {
    const shortToast = message => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    backHandlerClickCount += 1;
    if (backHandlerClickCount < 2) {
      shortToast('Press again to quit the application');
    } else {
      BackHandler.exitApp();
    }

    // timeout for fade and exit
    setTimeout(() => {
      backHandlerClickCount = 0;
    }, 1000);

    return true;
  };

  useEffect(() => {
    location();
  }, [find]);

  useEffect(() => {
    const {snack_bar_info} = ui_settings;
    if (snack_bar_info) setSnackBar(true);
    else setSnackBar(false);
  }, [ui_settings]);

  //run on the first screen render
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      jobUtils.unsubscribe_from_job_alerts();
    };
  }, []);

  //run each time this screen receives focus
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      if (!fundis.fundis.length) setBannerVisible(true);
      Object.keys(project_banner).length
        ? setProjectBannerVisibility(true)
        : setProjectBannerVisibility(false);
      // set ui resumed to true - means the user is at this current component
      setUiResumed(true);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
        setUiResumed(false);
      };
    }, []),
  );

  return (
    <View style={[styles.container]}>
      {/* All components with absolute position */}
      {is_ui_resumed && <HomeFab navigation={navigation} />}
      {/* ========================= START OF PAGE COMPONENTS ======================== */}
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
        {/* ====================== BANNER SECTION ======================= */}
        {/*  banner to show when new project has been initiated*/}
        <Banner
          visible={project_banner_visible}
          actions={[
            {
              label: 'Connect',
              onPress: () => {
                dispatch(UISettingsActions.hide_project_banner());
                navigation.navigate(screens.projects);
              },
            },
            {
              label: 'Close',
              onPress: () => {
                dispatch(UISettingsActions.hide_project_banner());
              },
            },
          ]}
          style={{
            marginTop: SIZES.device.height / 8,
          }}>
          {`${'The fundi you just requested'} has accepted your job offer. Click connect to open the project and connect`}
        </Banner>
        {/* banner section to display state of fundis */}
        {fundis.fundis.length < 1 && (
          <Banner style={{top: 60}} visible={bannerVisible} actions={[]}>
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
          <CurrentProject navigation={navigation} />
          <HomeBottomSheetContent
            init_refresh={enforce_fetch}
            navigation={navigation}
            bottomSheetTop={() => bottomSheetRef.current.snapTo()}
          />
        </ScrollView>
      </BottomSheet>
      {/* =============== Views that do not relatively align inside the parent container */}
      <View
        style={[
          {right: SIZES.padding_32, top: SIZES.padding_32},
          styles._fab_container,
        ]}>
        <EvilICons
          name="refresh"
          size={SIZES.icon_size}
          color={COLORS.secondary}
          onPress={() => dispatch(UISettingsActions.refresh_component())}
        />
      </View>
      <Snackbar
        visible={snackbar}
        style={{backgroundColor: COLORS.secondary}}
        onDismiss={() => {
          dispatch(UISettingsActions.snack_bar_info(''));
        }}
        action={{
          label: 'Okay',
          onPress: () => {
            // Do something
          },
        }}>
        {ui_settings.snack_bar_info}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _map_container: {
    height: '45%',
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
