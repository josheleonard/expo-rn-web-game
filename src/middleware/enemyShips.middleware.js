//Dependency Imports
import {Animated} from 'react-native';

//@REDUX_MIDDLEWARE
const enemyShipsMiddleware = store => next => action => {
  
  if (action.type == "ENEMY_SHIP_MOVED") {

  	//action payload
  	let {id, x, y, rotation} = action;

  	//redux state
  	let ship = store.getState().enemyShips[id];
  	
    //Animate enemy ship movement
	Animated.parallel([
		Animated.timing(ship.worldX, { 
			toValue: (universe.worldX._value - xyVector[0]),
			duration: 8,
			//useNativeDriver: true,
		}),
		Animated.timing(ship.worldY, {
			toValue: (universe.worldY._value + xyVector[1]),
			duration: 8,
			//useNativeDriver: true,
		}),
		Animated.timing(ship.rotation, { 
			toValue: (ship.rotation._value + ship.baseRotationSpeed),
			duration: 8,
			//useNativeDriver: true,
		}),
	]).start();

  }

  return next(action)
}

export default enemyShipsMiddleware;