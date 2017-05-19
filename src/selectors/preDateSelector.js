import { createSelector } from 'reselect';
import { moment } from 'moment';

const vineyardData = state => state.vineyardData;
const preParam = state => state.preParam;
const season = state => state.season;

const preDate = (vineyardData, preParam, season) => { return null; };

export default createSelector(
  vineyardData,
  preParam,
  season,
  preDate
);
