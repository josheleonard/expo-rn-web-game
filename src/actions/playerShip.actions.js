import calculateVector from '../functions/calculateVector';

const keys = { left: 37, right: 39, up: 38,} //which keys to track
const {left, right, up} = keys;


// redux thunk action
// gives us access to other chunks of the redux store's state
export function moveShip({x, y, rotation}) {
  	return (dispatch, getState) => {
  		let xyVector;

  		let {controller} = getState();

	    switch(true) {

	      case controller[up] && controller[right]: 
	        
	        xyVector = calculateVector(this.shipSpeed, this.shipRotation._value)

	        dispatch({
			    type: "PLAYER_SHIP_MOVE",
			    
			    //payload/arguments
			    x: xyVector[0],
			    y: xyVector[1],
			    rotation: getState().playerShip.rotation + getState().playerShip.baseRotationSpeed,

			    //meta data for middleware
			    meta: {
    debounce: {
      time: 300,
      key: 'myAction'
    }
  }
	  		})
	        break;

	      case controller[up] && controller[left]: 
	        xyVector = calculateVector(this.shipSpeed, this.shipRotation._value)
	        dispatch({
			    type: "PLAYER_SHIP_MOVE",
			    
			    //payload/arguments
			    x: xyVector[0],
			    y: xyVector[1],
			    rotation: getState().playerShip.rotation - getState().playerShip.baseRotationSpeed,

			    //meta data for middleware
			    meta: {
    debounce: {
      time: 300,
      key: 'myAction'
    }
  }
	  		})
	        break;

	      case controller[left]:
	        dispatch({
			    type: "PLAYER_SHIP_MOVE",
			    //payload/arguments
			    x: getState().playerShip.worldX,
			    y: getState().playerShip.worldY,
			    rotation: getState().playerShip.rotation -getState().playerShip.baseRotationSpeed,
			    //meta data for middleware
			    meta: {
    debounce: {
      time: 300,
      key: 'myAction'
    }
  }
	  		})
	        break;

	      case controller[right]:
	        dispatch({
			    type: "PLAYER_SHIP_MOVE",
			    //payload/arguments
			    x: getState().playerShip.worldX,
			    y: getState().playerShip.worldY,
			    rotation: getState().playerShip.rotation + getState().playerShip.baseRotationSpeed,
			    //meta data for middleware
			    meta: {
    debounce: {
      time: 300,
      key: 'myAction'
    }
  }
	  		})
	        break;

	      case controller[up]:
	        xyVector = calculateVector(this.shipSpeed, this.shipRotation._value)
	        dispatch({
			    type: "PLAYER_SHIP_MOVE",
			    //payload/arguments
			    x: xyVector[0],
			    y: xyVector[1],
			    rotation: getState().playerShip.rotation + getState().playerShip.rotation,
			    //meta data for middleware
			    meta: {
    debounce: {
      time: 300,
      key: 'myAction'
    }
  }
	  		})
	        break

	      default: break;
	    } //done checking controls
	}
}

