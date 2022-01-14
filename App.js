import React, {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const App = () => {
  const hasLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    if (status === PermissionsAndroid.RESULTS.DENIED)
      ToastAndroid.show('Location denied by the user', ToastAndroid.LONG);
    else if (status === PermissionsAndroid.PERMISSIONS.RESULTS.NEVER_ASK_AGAIN)
      ToastAndroid.show(
        'Permissions will never be requested again',
        ToastAndroid.LONG,
      );
    return false;
  };

  const getCurrentLocation = async () => {
    const permitted = await hasLocationPermission();
    if (!permitted) return;

    Geolocation.getCurrentPosition(
      position => {
        console.log('Position Acquired', position);
      },
      error => {
        console.log('position failed ', error);
      },
      {},
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: 400,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bt: {
    height: 50,
    backgroundColor: 'blue',
  },
});

export default App;
