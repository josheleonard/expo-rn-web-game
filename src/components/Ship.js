import React from 'react';
import {Image, Animated} from 'react-native';

export default class Ship extends React.Component {
    render() {
        let {
            rotation,
            x,
            y,
            width,
            height
        } = this.props;
        return (
            <Animated.Image 
                style={
                    {
                        width,
                        height,
                        zIndex: 1000,
                        position: "absolute",
                        top: y - (height/2),
                        left: x - (width/2),
                        transform: [{rotate: rotation}],
                    }
                }
                source={require('./spaceship.png')}
            />
        )
    }
}