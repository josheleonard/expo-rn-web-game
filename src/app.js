import React from 'react';

import { View, Text, Image, Platform, TouchableOpacity} from 'react-native';

import Controller from './components/Controller';
import Ship from './ship.svg'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      shipRotation: 36000,
      shipRotationSpeed: 2,
      shipSpeed: 4, 
      shipX: 50,
      shipY: 50,
      up: false,
      right: false,
      left: false,
    }
    this.keyMap = {}
    this.keys = {
      left: 37,
      right: 39,
      up: 38,
    }

    this.calcVector.bind(this)
    this.loop.bind(this)
    this.setStateFromChild.bind(this)
  }
  
  componentWillMount() {
    if (Platform.OS == "web") {
      document.addEventListener("keydown", this.handleKeyDown.bind(this))
      document.addEventListener("keyup", this.handleKeyUp.bind(this))
    }
    requestAnimationFrame(() => {this.loop()});
  }

  setStateFromChild(state) {
    this.setState(state)
  }

  loop() {
    console.log("u " + this.state.up)
    console.log("l " + this.state.left)
    console.log("r " + this.state.right)
    let {shipRotation, shipRotationSpeed, shipSpeed, shipX, shipY}
    = this.state;
    let newRotation, newX, newY;
    let up = this.keyMap[this.keys.up] || this.state.up
    let left = this.keyMap[this.keys.left] || this.state.left
    let right = this.keyMap[this.keys.right] || this.state.right

    if (up && right) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation + shipRotationSpeed)
      newX = shipX
      newY = shipY
      this.setState({
        shipRotation: newRotation || shipRotation,
        shipX: newX || shipX,
        shipY: newY || shipY,
      })
    }
    else if (up && left) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation - shipRotationSpeed)
      newX = shipX
      newY = shipY
      this.setState({
        shipRotation: newRotation || shipRotation,
        shipX: newX || shipX,
        shipY: newY || shipY,
      })
    }
    else if (left) {
      newRotation = (shipRotation - shipRotationSpeed)
      this.setState({
        shipRotation: newRotation || shipRotation,
        shipX: newX || shipX,
        shipY: newY || shipY,
      })
    }
    else if (right) {
      newRotation = (shipRotation + shipRotationSpeed)
      this.setState({
        shipRotation: newRotation || shipRotation,
        shipX: newX || shipX,
        shipY: newY || shipY,
      })
    }
    else if (up) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newX = shipX
      newY = shipY
      this.setState({
        shipRotation: newRotation || shipRotation,
        shipX: newX || shipX,
        shipY: newY || shipY,
      })
    }

    requestAnimationFrame(() => {this.loop()});

  }

  calcVector(speed, angle) {
    let {shipX, shipY} = this.state;
    return {
        shipY: shipY - (speed * Math.cos(angle * Math.PI / 180)),
        shipX: shipX + ((speed * Math.sin(angle * Math.PI / 180)))
    }
  }

  handleKeyUp (event) {
    this.keyMap[event.keyCode] = false
  }

  handleKeyDown (event) {
    this.keyMap[event.keyCode] = true
  };

  render() {
    return(
      <View style={{display:"flex", flex: 1, height:100, width:100}}>
      <Controller
        setParentState={(state) => this.setStateFromChild(state)}
      />
      <View style={{display:"flex", flex:1, flexDirection:"row", alignSelf:"flex-start", alignItems:"center"}}>
    
        <Image style={
          {
            width: 100,
            height: 100,
            position: "absolute",
            top: this.state.shipY,
            left: this.state.shipX,
            transform: [{ rotate: this.state.shipRotation + 'deg'}]}
          } 
        source={require('./spaceship.png')} />
        
      
      
      
      </View>
    </View>
      
    )
  }
}