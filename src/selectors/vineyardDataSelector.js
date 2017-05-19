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

  console.log(preParam);
  const year1 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.hisYear; }).sortBy('time').value();
  const year2 = _.chain(data).filter(value => { return value.time.split("-")[0] === preParam.curYear; }).sortBy('time').value();

  const output = {};

  output[preParam.hisYear] = year1;
  output[preParam.curYear] = year2;

  console.log("output", output);
  return output;
};

export default createSelector(
  vineyardData,
  preParam,
  time_series
);
