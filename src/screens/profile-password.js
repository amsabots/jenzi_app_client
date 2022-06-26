import React from 'react';
import {Text, View} from 'react-native';
import {DefaultTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import {DefaultToolBar} from '../components';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProfilePasswordEditor = ({navigation, user_data}) => {
  return (
    <View>
      <DefaultToolBar navigation={navigation} title={'Passwod Editor'} />
    </View>
  );
};

export default connect(stateToProps)(ProfilePasswordEditor);
