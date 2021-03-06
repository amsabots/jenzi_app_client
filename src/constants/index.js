import * as theme from './themes';
import {screens} from './screens';

//universal theme provider
import {useTheme} from 'react-native-paper';

const appTheme = () => {
  const {colors} = useTheme();
  return colors;
};
const delay = (duration = 3000) => {
  return new Promise(res => setTimeout(res, duration));
};

const offline_data = {
  user: '@user',
  project_notification: '@project_notification',
};

const pusher_filters = {
  request_user: 'JOBREQUEST',
  request_user_timedout: 'PROJECTTIMEOUT',
  user_accepted: 'REQUESTACCEPTED',
  user_rejected: 'REQUESTDECLINED',
  project_created: 'new_project',
};

function generate_random_hex(length = 6) {
  const hex_range = '1234567890abcdefghijklmnopABCDEFGHIGKLMNOP';
  let hex_value = '';
  for (let i = 0; i < length; i++) {
    const rand_int = Math.floor(Math.random() * hex_range.length);
    hex_value += hex_range.charAt(rand_int);
  }
  return hex_value;
}

export {
  theme,
  screens,
  appTheme,
  delay,
  offline_data,
  pusher_filters,
  generate_random_hex,
};
