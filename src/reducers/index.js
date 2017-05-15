import { combineReducers } from 'redux';
import preDateReducer from './preDateReducer';
import vineyardDataReducer from './vineyardDataReducer';

const rootReducer = combineReducers({
  preDate: preDateReducer,
  vineyardData: vineyardDataReducer
});

export default rootReducer;
