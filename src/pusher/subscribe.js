import React from 'react';

import {useDispatch} from 'react-redux';
import {app_config} from '../config';
//
import Pusher from 'pusher-js/react-native';

const {PUSHER_CLUSTER, PUSHER_ID, PUSHER_KEY, PUSHER_SECRET} =
  app_config.pusher_config;

const connectToChannel = () => {
  const pusher = new Pusher(PUSHER_KEY, {cluster: PUSHER_CLUSTER});
  const channel = pusher.subscribe('andrewmw');
  console.log('');
  return channel;
};

const consumeUserInfo = () => {
  const binder = connectToChannel();
  binder.bind('pusher:subscription_succeeded', () => {
    binder.bind('user_accepted', data => {
      console.log(data);
    });
  });
};

export {consumeUserInfo};
