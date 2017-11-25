import React from 'react';
import {Image, Animated} from 'react-native';
import * as firebase from "firebase";

export default class Ship extends React.Component {
    
    constructor(props) {
      super(props);
      
      this.xy = new Animated.ValueXY({ x: 0, y: 0 });  
      this.rotation = new Animated.Value(0);
      this.interpolatedRotation = this.rotation.interpolate(
        { 
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg']
        }
      )

      this.deltaTimeMs = 0; 
      this.prevTimestamp = 0;

    }

    componentWillMount() {
      console.log("key", this.props.firebaseKey)
      if(this.props.firebaseKey && this.props.isEnemy) {
        firebase.database().ref(`users/${this.props.firebaseKey}`).on('value', (ship) => {
          console.log(ship.val())
          let {x, y, rotation, updatedAt } = ship.val(); // get current firebase values for the ship

          //buffer fast internet speeds
          this.deltaTimeMs = (updatedAt - this.prevTimestamp)
          this.prevTimestamp = updatedAt;
          // it has been more than two frames since the last value.
          if(this.deltaTimeMs >= 32) {
            //dirty check the values so that we only rerender ships that have moved
            if (this.xy.x._value !== x || this.xy.y._value !== y || this.rotation._value !== rotation) {
              //re-render
              Animated.parallel([
                Animated.timing(this.rotation,
                  {
                    toValue: rotation,
                    duration: 32,
                  }
                ),
                Animated.timing(this.xy,
                  {
                    toValue: {x, y},
                    duration: 32,
                  }
                )
              ]).start()
              //this.xy.setValue({x, y})
              //this.rotation.setValue(rotation)
            }//end dirty ship value check 
          } //end deltaTime check
        })// end firebaseRef.on
      }//end is enemy check
    }//end componentWillMount

    /*shouldComponentUpdate(nextProps, nextState) {
        let { rotation, x, y } = this.props;
        if( rotation !== nextProps.rotation || x !== nextProps.x || y !== nextProps.y) {
            return true;
        } else {
            return false;
        }
    }*/
    render() {
        let {
            rotation,
            x,
            y,
            width,
            height,
            isEnemy,
            firebaseKey,
        } = this.props;
        console.log("render", firebaseKey)
        return (
            <Animated.Image 
                style={
                    {
                        width,
                        height,
                        zIndex: 1000,
                        position: "absolute",
                        top: isEnemy ? this.xy.y : (y - (height/2)),
                        left: isEnemy ? this.xy.x : (x - (width/2)),
                        transform: [
                            {rotate: isEnemy 
                              ? this.rotation.interpolate(
                                  { 
                                    inputRange: [0, 360],
                                    outputRange: ['0deg', '360deg']
                                  }
                                )
                              : rotation
                          },
                            //{translateX: xy.x},
                            //{translateY: xy.y}
                        ],
                    }
                }
                source={require('./spaceship.png')}
            />
        )
    }
}