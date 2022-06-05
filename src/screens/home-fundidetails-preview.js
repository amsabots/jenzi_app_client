import React, {useState, useEffect} from 'react';
import {
  View,
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Portal, Modal, Divider, Button} from 'react-native-paper';

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

      {/* Some awesome modal stuff */}
      <Portal>
        {/* Success modal - prompt user to provide next screen prompt action input */}
        <Modal
          visible={true}
          onDismiss={() => console.log('modal hidden')}
          contentContainerStyle={styles._modal_style}>
          <View style={styles._modal_container_wrapper}>
            <LoaderSpinner.SuccessAnimation width={120} height={120} />
            <Text
              style={{
                ...FONTS.caption,
                marginHorizontal: SIZES.base,
                color: COLORS.secondary,
              }}>
              Fundi accepted your request. We have initiated the project
              automatically for the period it will be active. Please remember to
              update project status.
            </Text>
            <View style={styles._modal_footer_container}></View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZES.base,
  },
  _modal_style: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    minHeight: 200,
    marginHorizontal: SIZES.padding_16,
  },
  _modal_container_wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  _modal_footer_container: {
    marginTop: SIZES.padding_16,
    width: '100%',
    flex: 'row',
    justifyContent: 'space-between',
  },
  _modal_footer_btns: {
    flexGrow: 1,
  },
});

export default HomeDetailsPreview;
