import React from 'react';

import {useDispatch} from 'react-redux';
import {app_config} from '../config';
import Toast from 'react-native-toast-message';
//
import Pusher from 'pusher-js/react-native';

const {PUSHER_CLUSTER, PUSHER_ID, PUSHER_KEY, PUSHER_SECRET} =
  app_config.pusher_config;

const connectToChannel = () => {
  const pusher = new Pusher(PUSHER_KEY, {cluster: PUSHER_CLUSTER});
  const channel = pusher.subscribe('andrewmwebi');
  return channel;
};

const consumeUserInfo = () => {
  const binder = connectToChannel();
  binder.bind('pusher:subscription_succeeded', () => {
    binder.bind('user_accepted', data => {
      console.log(data);
    });
    binder.bind('requesting_fundi_timedout', data => {
      Toast.show({
        type: 'info',
        text2: `Unable to receive immediate response from the user. We try later, you can cancel and request for another fundi`,
      });
    });
  });
};

export {consumeUserInfo};
