import database from '@react-native-firebase/database';
import axios from 'axios';
import {store} from '../../App';
import {fundiActions, task_actions, UISettingsActions} from '../store-actions';

const subscribe_chat_rooms = user => {
  database()
    .ref(`/chatrooms/${user}`)
    .once('value')
    .then(el => {
      for (const [key, value] of Object.entries(el.toJSON())) {
        const chat_room = key;
        const fundiId = value.partyB;
        // get last message foreach chatroom
        database()
          .ref(`/chats/${chat_room}`)
          .limitToFirst(1)
          .on(`child_added`, snapshot => {
            console.log(snapshot);
          });
      }
    });
};

export {subscribe_chat_rooms};
