import {combineReducers} from 'redux';
import {UISettings} from './ui-store';
import {fundisData} from './fundis';

const allReducers = combineReducers({
  ui_settings: UISettings,
  fundis: fundisData,
});

export {allReducers};
