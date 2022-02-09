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
};

const pusher_filters = {
  request_user: 'request_user',
  request_user_timedout: 'requesting_fundi_timedout',
  user_accepted: 'user_accepted',
  project_created: 'new_project',
};

export {theme, screens, appTheme, delay, offline_data, pusher_filters};
