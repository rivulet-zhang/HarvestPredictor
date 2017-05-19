import { store } from '../index';

export default function(state={}, action){
  switch (action.type) {
    case `PREDICT`:
      return action.payload;
  }
  return state;
}
