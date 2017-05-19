import _ from 'lodash';
import moment from 'moment';

export default function(state={}, action){

  let newState = {};

  switch (action.type) {
    case `DATA_VINEYARD_PREV`:

      for(let i=0; i<action.payload.length; i++){
        let item = action.payload[i];
        let date = moment(item.time.split(' ')[0]).format('YYYY-MM-DD');
        if(!_.has(newState, date))
          newState[date] = [];
        newState[date].push(parseFloat(item.temp));
      }

      return {...state, ...newState};

    case `DATA_VINEYARD_CUR`:

      for(let i=0; i<action.payload.length; i++){
        let item = action.payload[i];
        let date = moment(item.time).format('YYYY-MM-DD');
        if(!_.has(newState, date))
          newState[date] = [];
        let temp = [item.max, item.min, item.avg];
        newState[date].push(...temp.map( ele => parseFloat(ele) ));
      }

      return {...state, ...newState};

  }
  return state;
}
