import React from 'react';
import {View} from 'react-native';

import {FundiDetails, DefaultToolBar} from '../components';

const HomeDetailsPreview = ({navigation}) => {
  return (
    <View>
      <DefaultToolBar navigation={navigation} />
      <FundiDetails />
    </View>
  );
};

export default HomeDetailsPreview;
