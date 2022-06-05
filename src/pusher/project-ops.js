import {endpoints, firebase_db} from '../endpoints';
import {popPushNotification} from '../notification';
import axios from 'axios';
import {store} from '../../App';
import {clientActions, fundiActions} from '../store-actions';
import {Vibration, ToastAndroid} from 'react-native';
const logger = console.log.bind(console, `[file: fb-projects.js]`);

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
  const {
    user: {clientId},
    createdAt,
    event,
    requestId,
  } = snapshot;
  if (!snapshot?.user) return;
  if (clientId !== userId) return;
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
        `Request timed Out`,
        `The fundi seems to be offline at this moment. Try again after a while or select another suitable fundi`,
      );
      store.dispatch(fundiActions.delete_current_requests());
      return await firebase_db.ref(`/jobalerts/${fundiId}`).remove();
    case 'REQUESTACCEPTED':
      if (!res.data) return;
      const {
        requestId: eventId,
        ttl,
        payload,
        user,
        destination: {accountId, name},
      } = res.data;
      axios
        .post(endpoints.client_service + '/jobs', {
          title: payload.title,
          fundiId: accountId,
          client: {
            id: user.clientId,
          },
        })
        .then(res => res.data)
        .then(async data => {
          await axios.get(
            endpoints.fundi_service +
              `/projects/start/${accountId}/${data.taskId}`,
          );
          Vibration.vibrate();
          helpers_notify(
            `Project request accepted. - We have initiated a connection channel`,
          );
          store.dispatch(chat_actions.active_chat(destination));
        })
        .catch(err => {
          Vibration.vibrate();
          popPushNotification(
            `Request error`,
            'The request could not be processed at this moment. Please try again later',
          );
        })
        .finally(() => {
          store.dispatch(fundiActions.delete_current_requests());
        });
      break;
    case 'REQUESTDECLINED':
      store.dispatch(fundiActions.delete_current_requests());
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
