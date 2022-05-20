import {endpoints, firebase_db} from '../endpoints';
import {popPushNotification} from '../notification';
import axios from 'axios';
import {store} from '../../App';
import {clientActions} from '../store-actions';

const logger = console.log.bind(console, `[file: fb-projects.js]`);

//request cancelled or it came in and expired
// return popPushNotification(
//   `Light note`,
//   `A request came in while your device was offline or disconnected. Kindly keep you device on the line for alerts`,
// );

export const subscribe_job_states = user => {
  logger(`[message: The system has been bound to firebase job states channel]`);
  firebase_db.ref(`/jobalerts`).on('value', async snapshot => {
    if (!snapshot.exists()) return;
    for (const [key, data] of Object.entries(snapshot.toJSON())) {
      const {
        createdAt,
        event,
        requestId,
        user: {clientId},
      } = data;
      if (clientId !== user) continue;
      const elapsed_seconds = Math.floor(
        (new Date().getTime() - createdAt) / 1000,
      );
      //delete the request and return
      if (Math.ceil(elapsed_seconds) > 120)
        return await firebase_db.ref(`/jobalerts/${key}`).remove();
      switch (event.trim()) {
        case 'JOBREQUEST':
          const res = await axios.get(
            `${endpoints.realtime_base_url}/jobs/requests/${requestId}`,
          );
          if (!res.data) return;
          const {requestId: eventId, ttl, payload, user} = res.data;
          // store.dispatch(clientActions.create_new_rqeuest(requestId, payload));
          // store.dispatch(clientActions.active_client(user));
          break;
        case 'PROJECTTIMEOUT':
          popPushNotification(
            `Request timed Out`,
            `The fundi seems to be offline at this moment. Try again after a while or select another suitable fundi`,
          );
          return await firebase_db.ref(`/jobalerts/${key}`).remove();
        default:
          console.log(event);
          return null;
      }
    }
  });
};

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
