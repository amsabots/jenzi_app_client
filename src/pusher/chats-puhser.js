import database from '@react-native-firebase/database';
import axios from 'axios';
import {store} from '../../App';
import {fundiActions, task_actions, UISettingsActions} from '../store-actions';

const subscribe_chat_rooms = user => {
  database()
    .ref(`/chatrooms/${user}`)
    .once('value')
    .then(el => {});
};

export {subscribe_chat_rooms};
