import {Animated} from 'react-native';


/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function playerShipReducer(state = [], action) {
  
  switch (action.type) {
  
	  case 'ENEMY_SHIP_ADDED':
	  //just track the firebase key of the ship in redux,
	  //the enemy ship container component will listen to that ref in the db
	  //and update the ship as needed
	  	return {
	  		...state,
	  		[action.ship.key]: action.ship
	  	};
	    break;
	  
	  default:
	    return state
  
  }
}