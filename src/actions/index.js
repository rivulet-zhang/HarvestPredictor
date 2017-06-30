import { csv as requestCsv } from 'd3-request';

// hardcoded value for now
const vineyard = 'bigRanch';
const PREDICTION_URL = `http://voxel.ecn.purdue.edu/weathertrends/temp_summary_${vineyard}.csv`;

export function loadInitialData() {

  return dispatch => {

    requestCsv('../data/seasonInfo.csv', (error, data) => {
      if(error) throw error;
      const season = data.filter( record => { return record.vineyard == vineyard;} );
      dispatch({ type:'DATA_SEASON', payload:season });
    });

    requestCsv(`../data/${vineyard}_weather.csv`, (error, data) => {
      if(error) throw error;
      dispatch({ type:'DATA_VINEYARD_PREV', payload:data });
    });

    requestCsv(PREDICTION_URL, (error, data) => {
      if(error) throw error;
      dispatch({ type:'DATA_VINEYARD_CUR', payload:data });
    });

  };
}


export function predict(vineyard, hisYear, curYear, season, startDateCurYear, method, option) {
  return {type:'PREDICT', payload:{vineyard, hisYear, curYear, season, startDateCurYear, method, option}};
}
