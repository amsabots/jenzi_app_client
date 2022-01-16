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

import {Provider, useSelector} from 'react-redux';
import {createStore} from 'redux';

import {allReducers} from './store';

const store = createStore(allReducers);

// ui components
import {PrimaryStatusBar} from './src/components';

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <PrimaryStatusBar />
      </View>
    </Provider>
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
