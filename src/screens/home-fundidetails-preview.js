import React, {useState, useEffect} from 'react';
import {
  View,
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import {useDispatch} from 'react-redux';

import {
  FundiDetails,
  DefaultToolBar,
  LoaderSpinner,
  LoadingNothing,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {fundiActions} from '../store-actions';

const HomeDetailsPreview = ({navigation, route}) => {
  const [is_ready, setReady] = useState(false);
  const data = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
      dispatch(fundiActions.set_selected_fundi(data));
    });
    return () => {
      setReady(false);
    };
  }, []);
  if (!is_ready)
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <LoadingNothing />
        <Text
          style={{
            ...FONTS.captionBold,
            textAlign: 'center',
            color: COLORS.blue_deep,
            marginTop: SIZES.padding_16,
          }}>
          Fetching data, please wait.....
        </Text>
      </View>
    );

  return (
    <View>
      <DefaultToolBar navigation={navigation} title="Fundi Info" />
      <FundiDetails />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZES.base,
  },
});

export default HomeDetailsPreview;
