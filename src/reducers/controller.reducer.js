/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you, but return a new object if the state changes.
 *
 */
export default function controllerReducer(state = {
	37: false,
	39: false,
	38: false,
}, action) {
	switch(action.type) {
		case "KEY_DOWN" :
			return {
				...state,
				[action.key]: true,
			};
			break;

		case "KEY_UP" :
			return {
				...state,
				[action.key]: false,
			};
			break;

		default:
			return state;
			break;

	}	
}