import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Controller from './components/Controller';
import Ship from './components/Ship';
import UniverseSprite from './universe.jpg'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      shipRotation: 36000,
      shipRotationSpeed: 4,
      shipSpeed: 6, 
      shipX: 50,
      shipY: 50,
      up: false,
      right: false,
      left: false,
    }
    //track keyboard key presses outside
    //of state because setState() triggers
    // a render(), which we need to keep to a minimum
    this.keyMap = {}
    this.keys = {
      left: 37,
      right: 39,
      up: 38,
    }
  }
  
  componentWillMount() {
    if (Platform.OS == "web") {
      document.addEventListener("keydown", this.handleKeyDown.bind(this))
      document.addEventListener("keyup", this.handleKeyUp.bind(this))
    }
    requestAnimationFrame(() => {this.loop()});
  }

  moveShip = (x, y, rotation) => {
    this.setState({
      shipRotation: rotation,
      shipX: x,
      shipY: y,
    })
  }

  setStateFromChild = (state) => {
    this.setState(state)
  }

  loop = () => {
    //check the keyboard and touch controller,
    //then update the ship if needed
    let {
      shipRotation, shipRotationSpeed, 
      shipSpeed, shipX, shipY
    } = this.state;
    let newRotation, newX, newY;
    let up = this.keyMap[this.keys.up] || this.state.up
    let left = this.keyMap[this.keys.left] || this.state.left
    let right = this.keyMap[this.keys.right] || this.state.right

    if (up && right) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation + shipRotationSpeed)
      newX = shipX
      newY = shipY
      this.moveShip((newX || shipX), (newY || shipY), (newRotation || shipRotation))
    }
    else if (up && left) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation - shipRotationSpeed)
      newX = shipX
      newY = shipY
      this.moveShip((newX || shipX), (newY || shipY), (newRotation || shipRotation))
    }
    else if (left) {
      newRotation = (shipRotation - shipRotationSpeed)
      this.moveShip((newX || shipX), (newY || shipY), (newRotation || shipRotation))
    }
    else if (right) {
      newRotation = (shipRotation + shipRotationSpeed)
      this.moveShip((newX || shipX), (newY || shipY), (newRotation || shipRotation))
    }
    else if (up) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newX = shipX
      newY = shipY
      this.moveShip((newX || shipX), (newY || shipY), (newRotation || shipRotation))
    }
    //Loop every frame
    requestAnimationFrame(() => {
      this.loop()
    });
  }

  calcVector = (speed, angle) => {
    let {shipX, shipY} = this.state;
    return {
        shipY: shipY - (speed * Math.cos(angle * Math.PI / 180)),
        shipX: shipX + (speed * Math.sin(angle * Math.PI / 180))
    }
  }

  handleKeyUp = (event) => {
    this.keyMap[event.keyCode] = false
  }

  handleKeyDown = (event) => {
    this.keyMap[event.keyCode] = true
  };

  render = () => {
    return (
      <AppWrapper>
        <Controller
          setParentState={
            (state) => this.setStateFromChild(state)
          }
        />
        <WorldBox>

          <Ship 
              y={this.state.shipY}
              x={this.state.shipX}
              rotation={this.state.shipRotation}/>

          <Universe />
        </WorldBox>
    </AppWrapper>
    )
  }
}

//CSS
const AppWrapper = styled.View`
  display: flex;
  flex: 1;
  height: 100px;
  width: 100px;
`
const WorldBox = styled.View`
  display: flex;  
  flex: 1;
  flexDirection: row;
  alignSelf: flex-start;
  alignItems: center;
  width: 800px;
  height: 800px;
  overflow: hidden;
`
const Universe = styled.Image`
background-image: url(${UniverseSprite});
width: 800px;
height: 800px;
zIndex: -3000;

`