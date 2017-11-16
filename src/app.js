import React from 'react';
import { Platform, Dimensions, Animated } from 'react-native';
import styled from 'styled-components/native';
import Controller from './components/Controller';
import Ship from './components/Ship';
import Universe from './components/Universe';

export default class App extends React.Component {
  constructor() {
    super()
    //constants
    this.shipRotationSpeed = 5;
    this.shipSpeed = 15;
    //Track animations outside of state 
    //to render only components monitoring the animation value
    this.shipRotation = new Animated.Value(36000);
    this.interpolatedShipRotation = this.shipRotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg']
    })
    this.worldXY = new Animated.ValueXY({x: -10000, y: -10000});
    //track keyboard key presses outside
    //of state because setState() triggers
    // a render(), which is very slow
    this.keyMap = {}
    this.keys = {
      left: 37,
      right: 39,
      up: 38,
    }
    this.xBounds = [0, Dimensions.get('window').width];
    this.yBounds = [0, Dimensions.get('window').height];
    this.xCenter = this.xBounds[1]/2;
    this.yCenter = this.yBounds[1]/2;
    this.handleKeyDown.bind(this)
    this.handleKeyUp.bind(this)
    this.resizeScreen.bind(this)
    this.resizeScreen.bind(this)
  }
  
  
  componentDidMount() {
    if (Platform.OS == "web") {
      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
      document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }
    Dimensions.addEventListener("change", () => this.resizeScreen());
    this.resizeScreen()
    requestAnimationFrame(() => {this.loop()});
  }

  resizeScreen() {
    this.xBounds = [0, Dimensions.get('window').width];
    this.yBounds = [0, Dimensions.get('window').height];
    this.xCenter = this.xBounds[1]/2;
    this.yCenter = this.yBounds[1]/2;
    this.forceUpdate()
  }

  moveShip = (x, y, rotation) => {
    this.worldXY.setValue({x, y})
    this.shipRotation.setValue(rotation)
  }

  setKeysFromController = ({up, left, right}) => {
    this.keyMap[this.keys.up] = up; 
    this.keyMap[this.keys.left] = left; 
    this.keyMap[this.keys.right] = right; 
  }

  //Main Logic Loop
  loop = () => {
    //check the keyboard and touch controller,
    //then update the ship if needed
    let shipRotationSpeed = this.shipRotationSpeed; 
    let shipSpeed = this.shipSpeed;
    let shipRotation = this.shipRotation._value;
    let worldX = this.worldXY.x._value;
    let worldY = this.worldXY.y._value;
    let newRotation, newX, newY;

    let up = this.keyMap[this.keys.up]
    let left = this.keyMap[this.keys.left]
    let right = this.keyMap[this.keys.right]

    if (up && right) {
      let {worldX, worldY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation + shipRotationSpeed)
      newX = worldX
      newY = worldY
      this.moveShip((newX || worldX), (newY || worldY), (newRotation || shipRotation))
    }
    else if (up && left) {
      let {worldX, worldY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation - shipRotationSpeed)
      newX = worldX
      newY = worldY
      this.moveShip((newX || worldX), (newY || worldY), (newRotation || shipRotation))
    }
    else if (left) {
      newRotation = (shipRotation - shipRotationSpeed)
      this.moveShip((newX || worldX), (newY || worldY), (newRotation || shipRotation))
    }
    else if (right) {
      newRotation = (shipRotation + shipRotationSpeed)
      this.moveShip((newX || worldX), (newY || worldY), (newRotation || shipRotation))
    }
    else if (up) {
      let {worldX, worldY} = this.calcVector(shipSpeed, shipRotation)
      newX = worldX
      newY = worldY
      this.moveShip((newX || worldX), (newY || worldY), (newRotation || shipRotation))
    }
    //Loop every frame
    requestAnimationFrame(() => {
      this.loop()
    });
  }

  calcVector = (speed, angle) => {
    let {x, y} = this.worldXY;
    return {
        worldY: y._value + (speed * Math.cos(angle * Math.PI / 180)),
        worldX: x._value - (speed * Math.sin(angle * Math.PI / 180))
    }
  }

  handleKeyUp(event) {
    this.keyMap[event.keyCode] = false
  }

  handleKeyDown(event) {
    this.keyMap[event.keyCode] = true
  };

  render = () => {
    return (
      <AppWrapper
        width={this.xBounds[1]}
        height={this.yBounds[1]}>
        
        <Universe 
          x={this.worldXY.x}
          y={this.worldXY.y} />
        <Controller
          setKeys={(keys) => this.setKeysFromController(keys)}
          height={100}
          width={100}
          y={this.yBounds[1] - 140}
          x={this.xBounds[0] + 40}
        />
        <Ship 
          y={this.yCenter}
          x={this.xCenter}
          rotation={this.interpolatedShipRotation}/>
    </AppWrapper>
    )
  }
}

//CSS
const AppWrapper = styled.View`
  display: flex;
  flex: 1;
  height: ${ props => props.width };
  width: ${ props => props.width };
`
const WorldBox = Animated.createAnimatedComponent(styled.View`
  display: flex;  
  flex: 1;
  flexDirection: row;
  alignSelf: flex-start;
  alignItems: center;
  width: 800px;
  height: 800px;
  overflow: hidden;
`)