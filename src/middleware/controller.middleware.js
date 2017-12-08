//Dependency Imports
import {Animated} from 'react-native';
import calculateVector from '../functions/calculateVector';

//FIREBASE
import {db, TIMESTAMP} from '../createReduxStore';

const KEY_MAP = { LEFT: 37, RIGHT: 39, UP: 38,} //which keys to track
const {LEFT, RIGHT, UP} = KEY_MAP;

//@REDUX_MIDDLEWARE
const controllerMiddleware = store => next => action => {
  
  if (action.type == "KEY_DOWN") {

  	//state
  	let state = store.getState()
  	let {playerShip, universe, screen, user} = state;

  	//action payload
  	let {keys} = action;

  	switch(true) {


		case keys[UP] && keys[RIGHT]: 
	        xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation._value)
	        //update firebase
	        db().ref('users/' + user.uid).set({
	        	x: screen.xCenter - (universe.worldX._value - xyVector[0]),
	        	y: screen.yCenter - (universe.worldY._value + xyVector[1]),
	        	rotation: (playerShip.rotation._value + playerShip.baseRotationSpeed),
	        	updatedAt: TIMESTAMP
	        });
	        //Animate
			Animated.parallel([
				Animated.timing(universe.worldX, { 
					toValue: (universe.worldX._value - xyVector[0]),
					duration: 8,
					//useNativeDriver: true,
				}),
				Animated.timing(universe.worldY, {
					toValue: (universe.worldY._value + xyVector[1]),
					duration: 8,
					//useNativeDriver: true,
				}),
				Animated.timing(playerShip.rotation, { 
					toValue: (playerShip.rotation._value + playerShip.baseRotationSpeed),
					duration: 8,
					//useNativeDriver: true,
				}),
			]).start();
	        break;

	    case keys[UP] && keys[LEFT]: 
	        xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation._value)
	        //update firebase
	        db().ref('users/' + user.uid).set({
	        	x: screen.xCenter - (universe.worldX._value - xyVector[0]),
	        	y: screen.yCenter - (universe.worldY._value + xyVector[1]),
	        	rotation: (playerShip.rotation._value - playerShip.baseRotationSpeed),
	        	updatedAt: TIMESTAMP
	        });
	        //Animate
			Animated.parallel([
				Animated.timing(universe.worldX, { 
					toValue: (universe.worldX._value - xyVector[0]),
					duration: 8,
					//useNativeDriver: true,
				}),
				Animated.timing(universe.worldY, { 
					toValue: (universe.worldY._value + xyVector[1]),
					duration: 8,
					//useNativeDriver: true,
				}),
				Animated.timing(playerShip.rotation, { 
					toValue: (playerShip.rotation._value - playerShip.baseRotationSpeed),
					duration: 8,
					//useNativeDriver: true,
				}),
			]).start();
	        break;

	    case keys[LEFT]:
	    	//update firebase
	        db().ref('users/' + user.uid).set({
	        	x: screen.xCenter - universe.worldX._value,
	        	y: screen.yCenter - universe.worldY._value,
	        	rotation: (playerShip.rotation._value - playerShip.baseRotationSpeed),
	        	updatedAt: TIMESTAMP
	        });
	    	//Animate
	      	playerShip.rotation.setValue(playerShip.rotation._value - playerShip.baseRotationSpeed)
	      	break;

	    case keys[RIGHT]:
	    	//update firebase
	        db().ref('users/' + user.uid).set({
	        	x: screen.xCenter - universe.worldX._value,
	        	y: screen.yCenter - universe.worldY._value,
	        	rotation: (playerShip.rotation._value + playerShip.baseRotationSpeed),
	        	updatedAt: TIMESTAMP
	        });
	    	//Animate
	        playerShip.rotation.setValue(playerShip.rotation._value + playerShip.baseRotationSpeed)
	        break;

	    case keys[UP]:
	        xyVector = calculateVector(playerShip.baseSpeed, playerShip.rotation._value)
	        //update firebase
	        db().ref('users/' + user.uid).set({
	        	x: screen.xCenter - (universe.worldX._value - xyVector[0]),
	        	y: screen.yCenter - (universe.worldY._value + xyVector[1]),
	        	rotation: playerShip.rotation._value,
	        	updatedAt: TIMESTAMP
	        });
	        //Animate
			Animated.parallel([
				Animated.timing(universe.worldX, { 
					toValue: (universe.worldX._value - xyVector[0]),
					duration: 8,
					//useNativeDriver: true,
				}),
				Animated.timing(universe.worldY, {
					toValue: (universe.worldY._value + xyVector[1]),
					duration: 8,
					//useNativeDriver: true,
				}),
			]).start();
	        break

	    default:
	    	break;
	    
	    } //done checking control


  }

  return next(action)
}

export default controllerMiddleware;