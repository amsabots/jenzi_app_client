import {endpoints, firebase_db} from '../endpoints';
import {popPushNotification} from '../notification';
import axios from 'axios';
import {store} from '../../App';
import {chat_actions, fundiActions, UISettingsActions} from '../store-actions';
import {Vibration, ToastAndroid} from 'react-native';
const logger = console.log.bind(console, `[file: fb-projects.js]`);
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

//request cancelled or it came in and expired
// return popPushNotification(
//   `Light note`,
//   `A request came in while your device was offline or disconnected. Kindly keep you device on the line for alerts`,
// );

export const subscribe_job_states = userId => {
  logger(`[message: The system has been bound to firebase job states channel]`);
  firebase_db.ref(`/jobalerts`).on('child_changed', async snapshot => {
    snapshot.exists() &&
      (await project_changes_handler(snapshot?.toJSON(), userId, snapshot.key));
  });
  firebase_db.ref(`/jobalerts`).on('child_added', async snapshot => {
    snapshot.exists() &&
      (await project_changes_handler(snapshot?.toJSON(), userId, snapshot.key));
  });
};

async function project_changes_handler(snapshot, userId, fundiId) {
  if (!snapshot?.user) return;
  //prettier-ignore
  const {user: {client_id}, createdAt, event, requestId} = snapshot;
  if (client_id !== userId) return;
  const elapsed_seconds = Math.floor((new Date().getTime() - createdAt) / 1000);
  //delete the request and return
  if (Math.ceil(elapsed_seconds) > 120)
    return await firebase_db.ref(`/jobalerts/${fundiId}`).remove();
  // process events
  const res = await axios.get(
    `${endpoints.realtime_base_url}/jobs/requests/${requestId}`,
  );
  switch (event.trim()) {
    case 'JOBREQUEST':
      Vibration.vibrate();
      break;
    case 'PROJECTTIMEOUT':
      Vibration.vibrate();
      popPushNotification(
        `Request timed out`,
        `The fundi seems to be offline at this moment. Try again after a while or select another suitable fundi`,
      );
      store.dispatch(fundiActions.delete_current_requests());
      return await firebase_db.ref(`/jobalerts/${fundiId}`).remove();
    case 'REQUESTACCEPTED':
      if (!res.data) return;
      const state = store.getState();
      //prettier-ignore
      const {fundis:{selected_fundi}, tasks:{project_data}} = state
      //this section should be executed after all the project pre & post handler calls have been completed - simply call it as the last action
      axios
        .post(`/fundi-tasks`, {
          fundiId: selected_fundi.id,
          taskId: project_data.id,
        })
        .then(async res => {
          Vibration.vibrate();
          store.dispatch(
            UISettingsActions.update_project_tracker({
              action: 1,
              payload: selected_fundi,
            }),
          );
          store.dispatch(chat_actions.active_chat(selected_fundi));
          //prettier-ignore
          await firebase_db.ref(`/jobalerts/${selected_fundi.account_id}`).update({event: 'ACK'});
        })
        .catch(err => {
          console.log(err);
          Vibration.vibrate();
          popPushNotification(
            `Request error`,
            'The request could not be processed at this moment. Please try again later',
          );
          return firebase_db.ref(`/jobalerts/${fundiId}`).remove();
        })
        .finally(() => {
          store.dispatch(fundiActions.delete_current_requests());
        });
      break;
    case 'REQUESTDECLINED':
      store.dispatch(fundiActions.delete_current_requests());
      store.dispatch(
        UISettingsActions.update_project_tracker({action: 2, payload: false}),
      );
      return await firebase_db.ref(`/jobalerts/${fundiId}`).remove();
    default:
      console.log(event);
      return null;
  }
}

export const jobUtils = {
  delete_entry: async function (accountId) {
    await firebase_db.ref(`/jobalerts/${accountId}`).remove();
  },
  update_client: async function client_alerts(alert, client_id, job_id) {
    await firebase_db.ref(`/jobalerts/${client_id}`).update({
      createdAt: new Date().getTime(),
      event: alert,
      requestId: job_id,
    });
  },

  unsubscribe_from_job_alerts: function () {
    firebase_db
      .ref(`/jobalerts/`)
      .off('value', () =>
        logger(`------- Unsubscribed from job updates ----------------`),
      );
  },
};

function helpers_notify(message) {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.TOP,
    ToastAndroid.LONG,
    0,
    40,
  );
}
