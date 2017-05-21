import { createSelector } from 'reselect';
import { moment } from 'moment';
import _ from 'lodash';

const vineyardData = state => state.vineyardData;
const preParam = state => state.preParam;
// {vineyard, hisYear, curYear, startDateCurYear}

const time_series = (vineyardData, preParam) => {

  const data = _.map(vineyardData, (value, key) => {
    return {time:key, temp:_.mean(value)};
  });

  const year1 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.hisYear; }).sortBy('time').value();
  const year2 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.curYear; }).sortBy('time').value();

  const output = [];
  for(let i=0; i<_.min([year1.length, year2.length]); i++){
    const item = {};
    item['time'] = year1[i].time.substring(5);
    item[preParam.hisYear] = year1[i].temp;
    item[preParam.curYear] = year2[i].temp;
    output.push(item);
  }
  return output;
};

export default createSelector(
  vineyardData,
  preParam,
  time_series
);
