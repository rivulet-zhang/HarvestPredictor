import { csv as requestCsv } from 'd3-request';

export function predict(vineyard, hisYear, curYear, startDateCurYear) {

  if(!vineyard)
    return {type:'CANCEL'};

  return dispatch => {
    requestCsv('../data/seasonInfo.csv', (error, data) => {
      if(error) throw error;

      const season = data.filter( record => { return record.vineyard == vineyard;} );

      requestCsv(`../data/${vineyard}_weather.csv`, (error, data) => {
        dispatch({ type:'PREDICTION', payload:{season, data} })
      });

    });
  };

}

function predictAlgo(){
  console.log('placeholder');
}
