//sqlite
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {store} from '../../App';
import {offline_data} from '../constants';
import {axios_endpoint_error, endpoints} from '../endpoints';
import {user_data_actions} from '../store-actions';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';
import {ToastAndroid} from 'react-native';

export const refresh_saved_user = id => {
  axios
    .get(`/clients/${id}`)
    .then(async res => {
      if (res.data) {
        await AsyncStorage.setItem(offline_data.user, JSON.stringify(res.data));
        store.dispatch(user_data_actions.create_user(res.data));
        // prettier-ignore
        ToastAndroid.show('User info updated - Refresh to preview', ToastAndroid.LONG);
      }
    })
    .catch(err => axios_endpoint_error(err));
};
