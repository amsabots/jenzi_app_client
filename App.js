import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
//paper react native ui lib
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
//navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import {allReducers} from './store';

const store = createStore(allReducers);

// ui components
import {PrimaryStatusBar} from './src/components';

//stack screen
import {AppDrawerNavigator, AuthNavigator} from './src/navigation';
import {screens, theme} from './src/constants';

// app theme - colors and fonts
const appTheme = {
  ...DefaultTheme,
  color: {
    ...DefaultTheme.colors,
    primary: theme.COLORS.primary,
    accent: theme.COLORS.secondary,
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={appTheme}>
        <PrimaryStatusBar />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={screens.stack_app}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name={screens.stack_app}
              component={AppDrawerNavigator}
            />
            <Stack.Screen name={screens.stack_auth} component={AuthNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
