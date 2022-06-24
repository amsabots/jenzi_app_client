import Toast from 'react-native-toast-message';
import {firebase} from '@react-native-firebase/database';

export const endpoints = {
  notification_server: 'http://159.223.37.196:27500/realtime-server',
  client_service: `http://159.223.37.196:27900/client/api`,
  fundi_service: `http://159.223.37.196:27800/fundi/api`,
  realtime_base_url: `http://159.223.37.196:27500`,
  firebase_database: `https://jenzi-1234d-default-rtdb.asia-southeast1.firebasedatabase.app/`,
  jenzi_backend: `http://159.223.37.196:18300`,
};

export const firebase_db = firebase.app().database(endpoints.firebase_database);
export const errorMessage = err => {
  if (err.response) {
    const {data, status} = err.response;
    Toast.show({
      type: 'error',
      text1: status === 403 ? 'Bad credetials' : 'Request failed',
      text2:
        status === 403
          ? 'Invalid email/phone and password provided'
          : data.message,
      position: 'bottom',
    });
  } else {
    console.log('AXIOS CALL ERROR: ', err);
    Toast.show({
      type: 'error',
      text1: 'Service unavailable',
      text2: 'Check your network and try again later',
    });
  }
};

export const axios_endpoint_error = error => {
  if (error?.response) {
    let err = error.response.data;
    //prettier-ignore
    err = typeof err !=="string" || err.length > 70 ? "Error processing your request": err
    console.log();
    Toast.show({
      type: 'error',
      text1: 'Request Error',
      text2: err,
      position: 'center',
    });
  } else {
    console.log(error);
    Toast.show({
      type: 'error',
      text1: 'Service unavailable',
      text2: 'Check your network and try again later',
    });
  }
};
