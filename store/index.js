import {combineReducers} from 'redux';
import {UISettings} from './ui-store';
import {fundisData} from './fundis';
import {transactions} from './transactions';
import {user_data} from './user';

const allReducers = combineReducers({
  ui_settings: UISettings,
  fundis: fundisData,
  transactions,
  user_data,
});

export {allReducers};
