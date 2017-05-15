export default function(state=null, action){
  switch (action.type) {
    case 'PREDICTION':
      console.log(`PREDICTION received by reducer!`, action.payload);
      return action.payload;
  }
  return state;
}
