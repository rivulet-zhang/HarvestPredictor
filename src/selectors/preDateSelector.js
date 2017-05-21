import { createSelector } from 'reselect';
import moment from 'moment';
import _ from 'lodash';

const vineyardData = state => state.vineyardData;
const preParam = state => state.preParam;
const season = state => state.season;
// {vineyard, hisYear, curYear, startDateCurYear}

const preDate = (vineyardData, preParam, season) => {

  const data = _.map(vineyardData, (value, key) => {
    return {time:key, temp:_.mean(value)};
  });

  const year1 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.hisYear; }).sortBy('time').value();
  const year2 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.curYear; }).sortBy('time').value();

  let hisSeason = _.filter(season, value => { return value.vineyard === preParam.vineyard && value.year === preParam.hisYear; });
  hisSeason = hisSeason.length == 1 ? hisSeason[0] : null;

  if(!_.has(hisSeason, 'budbreak') || !_.has(hisSeason, 'harvest') /* || !_.has(curSeason, 'budbreak') */ )
    return null;

  console.log(hisSeason);
  let gdd = 0;
  const hisBudbreak = moment(hisSeason['budbreak']).format('YYYY-MM-DD');
  const hisHarvest = moment(hisSeason['harvest']).format('YYYY-MM-DD');
  const curBudbreak = preParam.startDateCurYear;
  let curHarvest = null;

  // calculate GDD summation;
  _.forEach(year1, value => {
    if(value.time >= hisBudbreak && value.time <= hisHarvest)
      gdd += _.max([value.temp-50, 0]);
  });

  // predict harvest date;
  _.forEach(year2, value => {
    if(value.time >= curBudbreak && gdd > 0){
      gdd -= _.max([value.temp-50, 0]);
      if(gdd <= 0) curHarvest = value.time;
    }

  });

  if(!curHarvest)
    return null;

  return {hisYear:preParam.hisYear, hisBudbreak, hisHarvest, curYear:preParam.curYear, curBudbreak, curHarvest};

};

export default createSelector(
  vineyardData,
  preParam,
  season,
  preDate
);
