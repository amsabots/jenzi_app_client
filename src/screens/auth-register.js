import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

//redux
import {useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {UISettingsActions} from '../store-actions';

import {LoaderSpinner, LoadingNothing} from '../components';
import {TextInput, Button} from 'react-native-paper';

//icon
import {screens} from '../constants';

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  return (
    <ScrollView style={{backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <View>
          <LoadingNothing label={'JENZI AFRICA'} textColor={COLORS.white} />
        </View>

        <View style={styles.wrapper}>
          <Text
            style={{
              ...FONTS.h5,
              fontWeight: '900',
              color: COLORS.secondary,
              marginBottom: SIZES.padding_32,
            }}>
            Sign Up
          </Text>
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'account-circle'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Official Name"
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'transparent'}]}
            left={
              <TextInput.Icon
                name={'phone'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="phonenumber/email"
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[styles._input_field, {backgroundColor: 'white'}]}
            left={
              <TextInput.Icon
                name={'eye'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Password"
            secureTextEntry={true}
          />
          <TextInput
            dense={true}
            activeUnderlineColor={COLORS.secondary}
            style={[{backgroundColor: 'white'}]}
            left={
              <TextInput.Icon
                name={'eye'}
                color={COLORS.grey_dark}
                style={{marginRight: SIZES.base}}
              />
            }
            placeholder="Confirm password"
            secureTextEntry={true}
          />
          <Text style={{...FONTS.caption, marginTop: SIZES.padding_12}}>
            By signing you agree to our{' '}
            <Text style={{color: COLORS.secondary, fontWeight: '800'}}>
              Terms and Conditions
            </Text>
          </Text>
          <Button
            mode="contained"
            style={{
              backgroundColor: COLORS.secondary,
              marginTop: SIZES.size_48,
            }}>
            Sign up
          </Button>
          <Text
            style={{marginTop: SIZES.padding_16, textAlign: 'center'}}
            onPress={() => navigation.navigate(screens.login)}>
            Already have an account?{' '}
            <Text style={{color: COLORS.blue_deep, ...FONTS.body_medium}}>
              Login
            </Text>
          </Text>
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
});

export default Register;
