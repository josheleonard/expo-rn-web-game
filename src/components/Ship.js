import React from 'react';
import {Image, Animated} from 'react-native';

export default class Ship extends React.Component {
    render() {
        let {
            rotation,
            x,
            y
        } = this.props;
        return (
            <Animated.Image 
                style={
                    {
                        width: 100,
                        height: 100,
                        position: "absolute",
                        top: y,
                        left: x,
                        transform: [{rotate: rotation}],
                    }
                }
                source={require('./spaceship.png')}
            />
        )
    }
}