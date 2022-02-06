import React from 'react';

import {store} from '../../App';
import {fundiActions} from '../store-actions';
import {app_config} from '../config';
import Toast from 'react-native-toast-message';
//
import Pusher from 'pusher-js/react-native';
import {ToastAndroid} from 'react-native';

const {PUSHER_CLUSTER, PUSHER_KEY} = app_config.pusher_config;

const connectToChannel = c => {
  const pusher = new Pusher(PUSHER_KEY, {cluster: PUSHER_CLUSTER});
  const channel = pusher.subscribe(c);
  return channel;
};

const consumeUserInfo = c => {
  //const dispatch = useDispatch();

  const binder = connectToChannel(c);
  binder.bind('pusher:subscription_succeeded', () => {
    binder.bind('user_accepted', data => {
      console.log(data);
    });
    binder.bind('requesting_fundi_timedout', data => {
      store.dispatch(fundiActions.delete_current_requests(data));
      Toast.show({
        type: 'info',
        text2: `Unable to receive immediate response from the user. We try later, you can cancel and request for another fundi`,
        onHide: () =>
          ToastAndroid.show(
            'Fundi not available at this moment, Please try again later',
            ToastAndroid.LONG,
          ),
      });
    });
  });
};

export {consumeUserInfo};
