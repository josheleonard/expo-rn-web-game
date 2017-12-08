import {Animated} from 'react-native';

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function universeReducer(
	state = { /*default Ship State*/
				
				height: 100,
				width: 100,
				scale: 1,

				screenX: 1,
				screenY: 1,
				worldX: new Animated.Value(1),
				worldY: new Animated.Value(1),

			}, action) {
  
  switch (action.type) {
	  
	  default:
	    return state
  
  }
}