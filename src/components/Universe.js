import React from 'react';
import { Image, View, Animated } from 'react-native'; 

export default class Universe extends React.Component{
  render() {
    let {x, y, children, style} = this.props;
    const resizeMode = 'cover';
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
          top: 0,
          left: 0,
          backgroundColor: '#eee',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            width: 4412*9,
            height: 1939*9,
            zIndex: 0,
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
              zIndex: 0,
              resizeMode,
            }}
            source={require('./universe.jpg')}
          />
        </Animated.View>
      </View>
    );
  }
}