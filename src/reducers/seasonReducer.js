export default function(state=[], action){
  switch (action.type) {
    case `DATA_SEASON`:
      return action.payload;
  }
  return state;
}
