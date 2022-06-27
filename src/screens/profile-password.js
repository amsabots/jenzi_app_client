import axios from 'axios';
import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {connect} from 'react-redux';
import {CircularImage, DefaultToolBar, LoadingModal} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {axios_endpoint_error, endpoints} from '../endpoints';
import {CustomInpuTextInput} from './profile-basic-editor';
import Toast from 'react-native-toast-message';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProfilePasswordEditor = ({navigation, user_data}) => {
  const {user} = user_data;
  const [loading, set_loading] = useState(false);
  const [data, set_data] = useState({});
  const handle_input_change = obj => {
    set_data(prev => {
      return {...prev, ...obj};
    });
  };

  const handle_submit_data = () => {
    const {password, password1} = data;
    console.log(data);
    if (!password || password !== password1)
      return Toast.show({
        type: 'error',
        text2: 'Password fields are compulsory and should be similar',
      });
    set_loading(true);
    axios
      .post(`/clients/reset-password/${user.id}`, {password: data.password})
      .then(res => {
        return Toast.show({
          type: 'success',
          text2: 'Update complete',
        });
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => set_loading(false));
  };
  return (
    <View style={{flex: 1}}>
      <DefaultToolBar navigation={navigation} title={'Passwod Editor'} />
      <View style={styles._wrapper_card}>
        <Card style={styles._card_container}>
          <View style={styles._top_image}>
            <CircularImage size={100} />
          </View>
          <View style={{marginTop: 80, paddingHorizontal: SIZES.base}}>
            <Text
              style={{
                marginBottom: SIZES.padding_16,
                ...FONTS.body_medium,
                color: COLORS.secondary,
              }}>
              Change password
            </Text>
            <CustomInpuTextInput
              label={'New password'}
              onTextChange={txt => handle_input_change({password: txt})}
              secureTextEntry={true}
            />
            {/* prettier-ignore */}
            <CustomInpuTextInput label={'Verify password'}  onTextChange={txt=>handle_input_change({password1:txt})}
             secureTextEntry={true}/>
            <Button
              mode="outlined"
              style={{
                borderColor: COLORS.secondary,
                marginTop: SIZES.padding_16,
              }}
              onPress={handle_submit_data}
              labelStyle={{
                color: COLORS.secondary,
                textTransform: 'capitalize',
              }}>
              Update password
            </Button>
          </View>
        </Card>
      </View>
      <LoadingModal show={loading} label={'Please wait....'} />
    </View>
  );
};

const styles = StyleSheet.create({
  _card_container: {
    height: '80%',
    width: '100%',
    padding: SIZES.base,
  },
  _wrapper_card: {
    padding: SIZES.padding_16,
    justifyContent: 'center',
  },
  _top_image: {
    width: '100%',
    position: 'absolute',
    top: -50,
    alignItems: 'center',
  },
});

export default connect(stateToProps)(ProfilePasswordEditor);
