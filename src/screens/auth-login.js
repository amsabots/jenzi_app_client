import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ToastAndroid, ScrollView} from 'react-native';

//redux
import {useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {UISettingsActions, user_data_actions} from '../store-actions';

import {LoaderSpinner, LoadingNothing} from '../components';
import {TextInput, Button} from 'react-native-paper';
//axios network request
import axios from 'axios';
//sqlite
import AsyncStorage from '@react-native-async-storage/async-storage';

import {offline_data, screens} from '../constants';
import {endpoints, errorMessage} from '../endpoints';
// data validation
import {auth_validator} from '../utils';

const Login = ({navigation}) => {
  // screen state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
    return () => {
      setLoading(false);
    };
  }, []);

  const handleLogin = () => {
    if (!email || !password)
      return ToastAndroid.show(
        'Phone number and password are required',
        ToastAndroid.LONG,
      );
    const valid = auth_validator.login_schema.validate({email});
    if (valid?.error)
      return ToastAndroid.show(
        'Invalid phone number format or length - check and try again',
        ToastAndroid.LONG,
      );
    setLoading(true);
    axios
      .post(`${endpoints.client_service}/clients/details-email`, {
        email: email.toLowerCase(),
        password,
      })
      .then(async res => {
        await AsyncStorage.setItem(offline_data.user, JSON.stringify(res.data));
        dispatch(user_data_actions.create_user(res.data));
        ToastAndroid.show('Welcome to Jenzi', ToastAndroid.LONG);
      })
      .catch(err => {
        errorMessage(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  });

  return (
    <ScrollView style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <View>
          <LoadingNothing textColor={COLORS.white} />
          <Text style={{...FONTS.h4, textAlign: 'center', color: COLORS.white}}>
            Jenzi Smart
          </Text>
        </View>

        <View style={styles.wrapper}>
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.secondary,
              marginBottom: SIZES.size_48,
            }}>
            Login
          </Text>
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'phone'}
                color={COLORS.secondary}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={email}
            onChangeText={txt => setEmail(txt)}
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[{backgroundColor: 'white'}]}
            left={
              <TextInput.Icon
                name={'eye'}
                color={COLORS.secondary}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="password"
            secureTextEntry={true}
            value={password}
            onChangeText={txt => setPassword(txt)}
          />
          <Text
            style={{
              ...FONTS.captionBold,
              color: COLORS.blue_deep,
              marginVertical: SIZES.padding_12,
              textAlign: 'right',
            }}
            onPress={() => navigation.navigate(screens.reset_pass)}>
            Forgot password
          </Text>
          {/* Button Area */}
          <View style={[styles._action_area]}>
            <Button
              mode="contained"
              loading={load}
              onPress={handleLogin}
              style={{
                backgroundColor: COLORS.secondary,
              }}>
              <Text style={{...FONTS.captionBold}}> Login</Text>
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate(screens.register)}
              style={{borderColor: COLORS.blue_deep}}>
              <Text style={{...FONTS.captionBold}}>New account</Text>
            </Button>
          </View>
          {/* End of action area */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    flex: 1,
    paddingTop: SIZES.padding_32,
  },
  wrapper: {
    backgroundColor: COLORS.white,
    flex: 1,
    marginTop: SIZES.size_48,
    borderTopLeftRadius: SIZES.padding_16,
    borderTopRightRadius: SIZES.padding_16,
    padding: SIZES.padding_32,
  },
  _input_field: {
    marginBottom: SIZES.padding_32,
  },
  _action_area: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding_32,
  },
});

export default Login;
