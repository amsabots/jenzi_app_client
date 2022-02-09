import React from 'react';

import {store} from '../../App';
import {fundiActions} from '../store-actions';
import {app_config} from '../config';
import Toast from 'react-native-toast-message';
//
import Pusher from 'pusher-js/react-native';
import {ToastAndroid} from 'react-native';
import {pusher_filters} from '../constants';
import axios from 'axios';
import {endpoints} from '../endpoints';

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
    //  USER ACCEPTED
    binder.bind(pusher_filters.user_accepted, data => {
      const {payload, sourceAddress, destinationAddress, requestId} = data;
      const delete_request = axios.delete(
        `${endpoints.notification_server}/notify/${requestId}`,
      );
      const create_project = axios.post(
        `${endpoints.client_service}/jobs`,
        {
          title: payload.title,
          client: {
            id: store.getState().user_data.user.id,
          },
        },
        {timeout: 60000},
      );

      Promise.all([create_project])
        .then(d => {
          console.log(d[0].data);
        })
        .catch(err => {
          console.log(err);
          ToastAndroid.showWithGravity(
            'Project cannot be initiated at this time',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        });
    });
    // USER REQUEST TIMEDOUT
    binder.bind(pusher_filters.request_user_timedout, data => {
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
