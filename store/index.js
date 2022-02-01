import {combineReducers} from 'redux';
import {UISettings} from './ui-store';
import {fundisData} from './fundis';
import {transactions} from './transactions';

const allReducers = combineReducers({
  ui_settings: UISettings,
  fundis: fundisData,
  transactions,
});

export {allReducers};
