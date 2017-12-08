import React from 'react';
import {Image, Animated} from 'react-native';
import {connect} from 'react-redux';

export class Ship extends React.Component {
    
    constructor(props) {
      super(props);
    }

    render() {
        let {
            rotation,
            x,
            y,
            width,
            height,
        } = this.props;
        //console.log("render", firebaseKey)
        return (
            <Animated.Image 
                style={
                    {
                        width,
                        height,
                        zIndex: 1000,
                        position: "absolute",
                        top: (y - (height/2)),
                        left: (x - (width/2)),
                        transform: [
                          {
                            rotate: rotation.interpolate({ 
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


const mapStateToProps = (state) => ({
  rotation: state.playerShip.rotation
})

export default connect(mapStateToProps, null)(Ship)