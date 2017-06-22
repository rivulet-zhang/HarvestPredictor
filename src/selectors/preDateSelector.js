import { createSelector } from 'reselect';
import moment from 'moment';
import _ from 'lodash';

const vineyardData = state => state.vineyardData;
const preParam = state => state.preParam;
const season = state => state.season;
// {vineyard, hisYear, curYear, startDateCurYear}

const preDate = (vineyardData, preParam, season) => {

  // data used for prediction, containing all years
  // for historical years, such as 2016 and previous, we have hourly based data -> for each day len = 96
  // for current year (2017), we only have daily based data -> for each day len = 3 (max, min. avg)
  const data = _.map(vineyardData, (value, key) => {
    return {time:key, temp:value, daily:[_.max(value), _.min(value), _.mean(value)]};
  });

  // filter and sort two years' data
  const year1 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.hisYear; }).sortBy('time').value();
  const year2 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.curYear; }).sortBy('time').value();

  // get season information for two years
  let hisSeason = _.filter(season, value => { return value.vineyard === preParam.vineyard && value.year === preParam.hisYear; });
  hisSeason = hisSeason.length == 1 ? hisSeason[0] : null;

  if(!_.has(hisSeason, preParam.season) || !_.has(hisSeason, 'harvest') /* || !_.has(curSeason, 'budbreak') */ )
    return null;

  const hisStart = moment(hisSeason[preParam.season]).format('YYYY-MM-DD');
  const hisEnd = moment(hisSeason['harvest']).format('YYYY-MM-DD');
  const curStart = preParam.startDateCurYear;

  // start calculation
  let gdd_har = 0;
  let curEnd = null;

  // calculate GDD summation of historical year;
  _.forEach(year1, value => {

    if(value.time >= hisStart && value.time <= hisEnd)
      gdd_har += getQuantityPerDay(preParam.method)(value);
  });

  // note that for current year, we do not have hourly data
  const methodHere = preParam.method == 'GDD-hourly' ? 'GDD-daily' : preParam.method;
  // predict harvest date;
  _.forEach(year2, value => {
    if(value.time >= curStart && gdd_har > 0){
      gdd_har -= getQuantityPerDay(methodHere)(value);
      if(gdd_har <= 0) curEnd = value.time;
    }
  });

  if(!curEnd)
    return null;

  return {hisYear:preParam.hisYear, hisStart, hisEnd, curYear:preParam.curYear, curStart, curEnd, startSeason:preParam.season};

};

export default createSelector(
  vineyardData,
  preParam,
  season,
  preDate
);

// this value will return the quantity (either gdd or hdd) of one day based on the method
function getQuantityPerDay(method) {
  // input to the returning function is an object of {time, temp, daily}
  if (method == 'GDD-daily')
    return x => _.max([x.daily[2]-50, 0]);
  if (method == 'HDD-daily')
    return x => _.max([(x.daily[2]-50+x.daily[0]-50)*0.5, 0]);
  if (method == 'GDD-hourly')
    return x => {
      let cummulated = 0;
      for(let i=0; i<x.temp.length; i++) {
        cummulated += _.max([x.temp[i]-50, 0]);
      }
      return cummulated / x.temp.length;
    };

  throw new ERROR("ERROR calculating GDD");
}
