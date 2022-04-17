import {store} from '../../App';
import {endpoints, firebase_db} from '../endpoints';
import {chat_actions} from '../store-actions';
import axios from 'axios';
axios.defaults.baseURL = endpoints.fundi_service;

const logger = console.log.bind(console, `[file: chats.js]`);

export const subscribe_to_chatrooms = current_user => {
  logger(
    `------------------------ subscribed to system chat room ----------------------`,
  );
  firebase_db
    .ref(`/chatrooms/${current_user}`)
    .once('value')
    .then(async snapshot => {
      if (snapshot.exists()) {
        const d = snapshot.toJSON();
        const chat_room = [];
        for (const [key, value] of Object.entries(d)) {
          try {
            const chatroom = key;
            const partyB = value.partyB;
            const req_fundi = await axios.get(`/accounts/${partyB}`);
            chat_room.push({chatroom, client: req_fundi.data});
          } catch (error) {}
        }
        store.dispatch(chat_actions.load_chat_rooms(chat_room));
      }
    });
};
