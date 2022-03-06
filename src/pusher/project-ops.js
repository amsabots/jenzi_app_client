import React from 'react';

import {store} from '../../App';
import {fundiActions, task_actions, UISettingsActions} from '../store-actions';
import Toast from 'react-native-toast-message';
import {pusher_filters} from '../constants';
import axios from 'axios';
import {endpoints} from '../endpoints';

//pusher
import {connectToChannel} from '.';

const consumeUserInfo = c => {
  //const dispatch = useDispatch();

  const binder = connectToChannel(c);
  binder.bind('pusher:subscription_succeeded', () => {
    console.log(
      'Channel has been established between client and pusher servers',
    );
    //  USER ACCEPTED
    binder.bind(pusher_filters.user_accepted, data => {
      const {payload, sourceAddress, destinationAddress, requestId} = data;
      console.log(requestId);
      axios
        .delete(`${endpoints.notification_server}/notify/${requestId}`)
        .then(() => 'done')
        .then(async re => {
          axios
            .post(
              `${endpoints.client_service}/jobs`,
              {
                title: payload.title,
                fundiId: sourceAddress,
                client: {
                  id: store.getState().user_data.user.id,
                },
              },
              {timeout: 30000},
            )
            .then(async f => {
              store.dispatch(task_actions.add_job_entry([f.data]));
              store.dispatch(UISettingsActions.show_project_banner(f.data));
              store.dispatch(fundiActions.delete_current_requests());
              await axios.post(
                `${endpoints.realtime_base_url}/chats/chat-room`,
                {partyA: sourceAddress, partyB: destinationAddress},
              );
              store.dispatch(
                UISettingsActions.snack_bar_info(
                  'A new project has been started to view details, Go to Menu ad select Projects. A chat connection between you and the fundi has been activated',
                ),
              );
            });
        })
        .catch(err => {
          console.log('===== PROJECT CREATION ERROR =======', err);
          store.dispatch(
            UISettingsActions.snack_bar_info(
              'We cannot initiate a direct link between you and the fundi. Please try again later',
            ),
          );
        });
    });
    // USER REQUEST TIMEDOUT
    binder.bind(pusher_filters.request_user_timedout, data => {
      store.dispatch(fundiActions.delete_current_requests());
      store.dispatch(
        UISettingsActions.snack_bar_info(
          'The fundi you requested failed to respond within our delay limits. You can place a request for another one or try again later',
        ),
      );
      Toast.show({
        type: 'info',
        text2: `Unable to receive immediate response from the user. We try later, you can cancel and request for another fundi`,
      });
    });
    // USER REJECTED THE REQUEST
    binder.bind(pusher_filters.user_rejected, data => {
      store.dispatch(fundiActions.delete_current_requests());
      store.dispatch(
        UISettingsActions.snack_bar_info(
          'Ooops! We regret informing you that the ufundi you have requested declined your request. We will follow up on the actual reason and revert if necessary. SOrry for the inconveniences caused',
        ),
      );
    });
  });
};

export {consumeUserInfo};
