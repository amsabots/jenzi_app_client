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

export {theme, screens, appTheme, delay};
