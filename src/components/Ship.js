import React from 'react';
import {Image} from 'react-native';

export default function Ship ({
    rotation,
    x,
    y
}) {
    return <Image style={
        {
        width: 100,
        height: 100,
        position: "absolute",
        top: y,
        left: x,
        transform: [{ rotate: rotation + 'deg'}]}
        } 
        source={require('./spaceship.png')}
    />
}