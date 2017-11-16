import React, { Component } from 'react';
import {
  Image,
  View,
  Animated
} from 'react-native';

export default class Universe extends React.Component{
    render() {
      let {x, y, children, style} = this.props;
      const resizeMode = 'cover';
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#eee',
            overflow: 'hidden'
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              width: 4412*9,
              height: 1939*9,
              transform: [
                {translateX: x},
                {translateY: y}
              ]
            }}
          >
            <Image
              style={{
                display: 'flex',
                width: 4412*9,
                height: 1939*9,
                resizeMode,
              }}
              source={require('./universe.jpg')}
            />
          </Animated.View>
          
        </View>
      );
    }
}