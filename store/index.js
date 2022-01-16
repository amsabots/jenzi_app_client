import {combineReducers} from 'redux';
import {UISettings} from './ui-store';

const allReducers = combineReducers({ui_settings: UISettings});

export {allReducers};
