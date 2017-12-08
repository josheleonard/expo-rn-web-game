import React from 'react';
import { Image, View, Animated } from 'react-native';

import {connect} from 'react-redux';

import {universeXSelector, universeYSelector} from '../selectors/universe.selectors';

export class Universe extends React.Component{
  /*shouldComponentUpdate(nextProps, nextState) {
        let { x, y, children } = this.props;
        if( x !== nextProps.x || y !== nextProps.y || children !== nextProps.children) {
            if(children !== nextProps.children) {
              console.log("filthy damn kids!!!, you're killing my render time!!")
            }
            return true;
        } else {
            return false;
        }
    }*/
  render() {
    let {x, y, children, style} = this.props;
    const resizeMode = 'cover';
    return (
      <Animated.View
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
            source={require('./universe.jpg')}>
            {children}
          </Image>
        </Animated.View>
        
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
    x: state.universe.worldX,//universeXSelector(state),
    y: state.universe.worldY,//universeYSelector(state),
})

export default connect(mapStateToProps, null)(Universe)