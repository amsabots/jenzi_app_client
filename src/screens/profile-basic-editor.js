import React, {useState} from 'react';
import {Text, View, StyleSheet, ToastAndroid} from 'react-native';
import {Button, Switch, TextInput} from 'react-native-paper';
import {connect} from 'react-redux';
import {DefaultToolBar, LoadingModal} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import _ from 'lodash';
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';
import {refresh_saved_user} from '../utils/store-actions';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
import Toast from 'react-native-toast-message';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

// prettier-ignore
export const CustomInpuTextInput = ({name, value, label, onTextChange, ...props}) => {
  return (
    <TextInput
      {...props}
      label={label}
      value={value}
      mode="outlined"
      dense={true}
      underlineColorAndroid="transparent"
      activeOutlineColor={COLORS.blue_deep}
      style={{marginBottom: SIZES.padding_16}}
      onChangeText={txt=>onTextChange(txt)}
    />
  );
};

const ProfileBasicEditor = ({navigation, user_data}) => {
  const {user} = user_data;
  const {LONG, SHORT, CENTER, BOTTOM} = ToastAndroid;
  const [update_info, set_update_info] = useState(
    _.pick(user, 'phone_number', 'name'),
  );
  const [is_active, set_active] = useState(user.is_active);
  const [load, set_loading] = useState(false);

  const handleAccountStateChange = () => {
    set_active(!is_active);
  };
  const handle_input_change = obj => {
    set_update_info(prev => {
      return {...prev, ...obj};
    });
  };
  const handle_form_submission = () => {
    const _clean = _.omitBy(update_info, _.isNil);
    set_loading(true);
    axios
      .put(`/clients/${user.id}`, _clean)
      .then(res => {
        refresh_saved_user(user.id);
        // prettier-ignore
        Toast.show({type:"success", text2:"Information updated successfully"})
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => set_loading(false));
  };
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title={'Basic Detailss'} />
      <View style={styles.container}>
        <View style={styles._wrapper}>
          <Text
            style={{
              ...FONTS.body_bold,
              color: COLORS.blue_deep,
              marginBottom: SIZES.padding_16,
            }}>
            Profile details
          </Text>
          <CustomInpuTextInput
            label={'Your name'}
            value={update_info.name}
            onTextChange={txt => handle_input_change({name: txt})}
          />
          <CustomInpuTextInput
            label={'Phone number'}
            value={update_info.phone_number ?? user.username}
            onTextChange={txt => handle_input_change({phone_number: txt})}
          />
          <Button
            mode="contained"
            onPress={handle_form_submission}
            style={{
              marginVertical: SIZES.padding_32,
              backgroundColor: COLORS.secondary,
            }}>
            Submit
          </Button>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text style={{...FONTS.body_medium}}>
              {is_active ? 'Go offline' : 'Go back online'}
            </Text>
            <Switch
              color={COLORS.blue_deep}
              value={is_active}
              onValueChange={handleAccountStateChange}
            />
          </View>
        </View>
      </View>
      <LoadingModal show={load} label={'Please wait....'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _wrapper: {
    padding: SIZES.padding_16,
  },
});

export default connect(stateToProps)(ProfileBasicEditor);
