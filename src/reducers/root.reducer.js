import {combineReducers} from 'redux';

//Reducer Imports
import playerShipReducer from './playerShip.reducer';
import enemyShipsReducer from './enemyShips.reducer';
import universeReducer from './universe.reducer';
import controllerReducer from './controller.reducer';
import screenReducer from './screen.reducer';
import userReducer from './user.reducer';

const rootReducer = combineReducers({
	playerShip: playerShipReducer,
	universe: universeReducer,
	enemyShips: enemyShipsReducer,
	screen: screenReducer,
	user: userReducer,
});
export default rootReducer;