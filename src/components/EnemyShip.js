import React from 'react';
import {Image, Animated} from 'react-native';
import {db} from "../createReduxStore";
import {connect} from 'react-redux';


export class EnemyShip extends React.Component {
    
    constructor(props) {
      super(props);


      console.log(this.props)
      let {
        rotation,
        x,
        y,
        width,
        height,
        firebaseKey,
      } = this.props;

      console.log({
        rotation,
        x,
        y,
        width,
        height,
        firebaseKey,
      })
      
      this.xy = new Animated.ValueXY({ x, y });
      this.rotation = new Animated.Value(rotation);  

      this.deltaTimeMs = 0; 
      this.prevTimestamp = 0;

      

    }

    componentWillMount() {
      if(this.props.firebaseKey) {
        db().ref(`users/${this.props.firebaseKey}`).on('value', (ship) => {
          // get current firebase values for the ship
          let {x, y, rotation, updatedAt } = ship.val(); 

          //buffer fast internet speeds
          this.deltaTimeMs = (updatedAt - this.prevTimestamp)
          this.prevTimestamp = updatedAt;
          // it has been more than two frames since the last value.
          //if(this.deltaTimeMs >= 16) {
            //dirty check the values so that we only rerender ships that have moved
            if (this.xy.x._value !== x ||
                this.xy.y._value !== y ||
                this.rotation._value !== rotation) {
              //ENEMY_SHIP_MOVED
              //Animate movement
              Animated.parallel([
                Animated.timing(this.rotation,
                  {
                    toValue: rotation,
                    duration: 1,
                  }
                ),
                Animated.timing(this.xy,
                  {
                    toValue: {x, y},
                    duration: 1,
                  }
                )
              ]).start()
            }//end dirty ship value check 
          //} //end deltaTime check
        })// end firebaseRef.on
      }//end is enemy check
    }//end componentWillMount

    render() {
        //console.log("render", firebaseKey)
        let {width, height} = this.props;
        return (
            <Animated.Image 
                style={
                    {
                        width,
                        height,
                        zIndex: 1000,
                        position: "absolute",
                        top: this.xy.y,
                        left: this.xy.x,
                        transform: [
                            {rotate: this.rotation.interpolate({ 
                              inputRange: [0, 360],
                              outputRange: ['0deg', '360deg']
                            })
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

export default EnemyShip