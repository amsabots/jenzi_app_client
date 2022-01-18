import * as theme from './themes';
import {screens} from './screens';

//universal theme provider
import {useTheme} from 'react-native-paper';

const appTheme = () => {
  const {colors} = useTheme();
  return colors;
};

export {theme, screens, appTheme};
