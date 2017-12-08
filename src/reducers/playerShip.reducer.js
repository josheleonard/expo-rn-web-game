import {Animated} from 'react-native';


/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function playerShipReducer(
	state = { /*default Ship State*/
				height: 100,
				width: 100,
				screenX: 1,
				screenY: 1,
				worldX: 1,
				worldY: 1,
				rotation: new Animated.Value(36000),

				baseSpeed: 5,
				baseRotationSpeed: 2,
				
				health: 100,

				/*parts*/
				frameLevel: 1,
				shieldLevel: 1,
				thrusterLevel: 1,
				boosterLevel: 1,
				weaponsLevel: 1,

			}, action) {
  
  switch (action.type) {
  
	  case 'PLAYER_SHIP_MOVE':
	    return {
	    	...state,
	    	worldX: action.x,
	    	worldY: action.y,
	    	rotation: action.rotation
	    }
	    break;

	  case 'PLAYER_SHIP_ROTATE':
		  return {
		    	...state,
		    	rotation: action.rotation
		    }
		    break;

	  case 'PLAYER_SHIP_SHOOT': //TODO
	    return state
	    break;
	  
	  default:
	    return state
  
  }
}