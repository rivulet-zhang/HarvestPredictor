import { csv as requestCsv } from 'd3-request';

const PREDICTION_URL = `http://voxel.ecn.purdue.edu/weathertrends/temp_summary.csv`;

// hardcoded value for now
const vineyard = 'bigRanch';

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


export function predict(vineyard, hisYear, curYear, startDateCurYear) {
  return {type:'PREDICT', payload:{vineyard, hisYear, curYear, startDateCurYear}};
}
