import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
//redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions} from '../store-actions';

//iocns
import MIcons from 'react-native-vector-icons/MaterialIcons';
//Ui components
import {COLORS, SIZES} from '../constants/themes';
import {} from '../components';

const mapStateToProps = state => {
  return {state};
};

const Logout = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  return (
    <View styles={styles.container}>
      <MIcons
        color={COLORS.secondary}
        name="cancel"
        size={SIZES.icon_size}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'red', height: '100%'},
  content_wrapper: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default connect(mapStateToProps)(Logout);
