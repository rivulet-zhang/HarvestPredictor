import { combineReducers } from 'redux';
import vineyardDataReducer from './vineyardDataReducer';
import preParamReducer from './preParamReducer';
import seasonReducer from './seasonReducer';

const rootReducer = combineReducers({
  // initial data loading for prediction
  vineyardData: vineyardDataReducer,
  season: seasonReducer,
  // prediction parameters set in UI
  preParam: preParamReducer
});

export default rootReducer;
