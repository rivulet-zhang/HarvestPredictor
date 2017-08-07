import { createSelector } from 'reselect';
import moment from 'moment';
import _ from 'lodash';
import {scaleLinear} from 'd3-scale';

const vineyardData = state => state.vineyardData;
const preParam = state => state.preParam;
const season = state => state.season;
// {vineyard, hisYear, curYear, startDateCurYear}
let year1 = [], year2 = [];
let hisStart, hisEnd, curStart;

const preDate = (vineyardData, preParam, season) => {

  // data used for prediction, containing all years
  // for historical years, such as 2016 and previous, we have hourly based data -> for each day len = 96
  // for current year (2017), we only have daily based data -> for each day len = 3 (max, min. avg)
  const data = _.map(vineyardData, (value, key) => {
    if (value.length === 3) {
      // which is wt360 data
      return {time:key, hourly:[_.max(value), _.min(value)], daily:[_.max(value), _.min(value), _.mean(value)]};
    } else {
      // picovale data
      return {time:key, hourly:value, daily:[_.max(value), _.min(value), _.mean(value)]};
    }
  });

  // filter and sort two years' data
  year1 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.hisYear; }).sortBy('time').value();
  year2 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.curYear; }).sortBy('time').value();

  // get season information for two years
  let hisSeason = _.filter(season, value => { return value.vineyard === preParam.vineyard && value.year === preParam.hisYear; });
  hisSeason = hisSeason.length == 1 ? hisSeason[0] : null;

  if(!_.has(hisSeason, preParam.season) || !_.has(hisSeason, 'harvest') /* || !_.has(curSeason, 'budbreak') */ )
    return null;

  hisStart = moment(hisSeason[preParam.season]).format('YYYY-MM-DD');
  hisEnd = moment(hisSeason['harvest']).format('YYYY-MM-DD');
  curStart = preParam.startDateCurYear;

  // start calculation
  let gdd_har = 0;
  let curEnd = null;

  // calculate GDD summation of historical year;
  _.forEach(year1, value => {

    if(value.time >= hisStart && value.time <= hisEnd)
      gdd_har += getQuantityPerDay(preParam.method, preParam.option)(value);
  });

  // note that for current year, we do not have hourly data
  // predict harvest date;
  _.forEach(year2, value => {
    if(value.time >= curStart && gdd_har > 0){
      gdd_har -= getQuantityPerDay(preParam.method, preParam.option)(value);
      if(gdd_har <= 0) curEnd = value.time;
    }
  });

  if(!curEnd)
    return null;

  return {hisYear:preParam.hisYear, hisStart, hisEnd, curYear:preParam.curYear, curStart, curEnd, startSeason:preParam.season, model:preParam.method};

};

export default createSelector(
  vineyardData,
  preParam,
  season,
  preDate
);

function getDataOneDay(yearData, date) {
  for(const year of yearData) {
    if (year.time == date) {
      return year;
    }
  }
  return null;
}

// this value will return the quantity (either gdd or hdd) of one day based on the method
function getQuantityPerDay(method, option) {
  // input to the returning function is an object of {time, hourly, daily}
  if (method == 'GDD-daily') {
    return x => {
      const max = option == 'upperlimit-95' ? _.min([x.daily[0], 95]) : x.daily[0];
      const min = x.daily[1];
      const avg = (max+min)/2.0;
      const val = _.max([avg-50, 0]);
      return val;
    };
  }

  if (method == 'HDD-daily') {
    return x => {
      const max = option == 'upperlimit-95' ? _.min([x.daily[0], 95]) : x.daily[0];
      const min = x.daily[1];
      const avg = (max+min)/2.0;
      return _.max([(avg-50+max-50)/2.0, 0]);
    }
  }

  if (method == 'GDD-hourly')
    return x => {
      const flag = x.hourly.length == 2 && getDataOneDay(year1, `${hisStart.substring(0, 4)}${x.time.substring(4)}`) != null;
      // GDD hourly data is available (historical data)
      if (!flag) {
        let cummulated = 0;
        for(let i=0; i<x.hourly.length; i++) {
          const tmp = option == 'upperlimit-95' ? _.min([x.hourly[i], 95]) : x.hourly[i];
          cummulated += _.max([tmp-50, 0]);
        }
        const val = cummulated / x.hourly.length;
        return val;
      }
      // GDD hourly data is not available, try to model the hourly data based on previous year
      else {
        const hisData = getDataOneDay(year1, `${hisStart.substring(0, 4)}${x.time.substring(4)}`);
        const hourly = hisData.hourly;
        const minmax = [_.min(hourly), _.max(hourly)];
        const mapping = scaleLinear()
          .domain([minmax[0], minmax[1]])
          .range([x.hourly[1], x.hourly[0]]);

        let cummulated = 0;
        hourly.forEach(val => {
          const mapped = mapping(val);
          const tmp = option == 'upperlimit-95' ? _.min([mapped, 95]) : mapped;
          cummulated += _.max([tmp-50, 0]);
        });
        const val = cummulated / hourly.length;
        // // for comparison only
        // let accm_new = 0;
        // let tmp = option == 'upperlimit-95' ? _.min([x.hourly[0], 95]) : x.hourly[0];
        // accm_new += _.max([tmp-50, 0]);
        // tmp = option == 'upperlimit-95' ? _.min([x.hourly[1], 95]) : x.hourly[1];
        // accm_new += _.max([tmp-50, 0]);
        //
        // console.log('compare', val, accm_new / 2);
        return val;
      }
    };

  throw new ERROR("ERROR calculating GDD");
}
