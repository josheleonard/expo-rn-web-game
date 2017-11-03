import React from 'react';

import { View, Text, Image, Platform} from 'react-native';
import Ship from './ship.svg'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      shipRotation: 36000,
      shipRotationSpeed: 6,
      shipSpeed: 6, 
      shipX: 50,
      shipY: 50,
      keyMap: {}
    }

    this.keys = {
      left: 37,
      right: 39,
      up: 38,
    }

    this.calcVector.bind(this)
    this.loop.bind(this)
    this.moveLeftPress.bind(this)
  }
  
  componentWillMount() {
    if (Platform.OS == "web") {
      console.log(2)
      document.addEventListener("keydown", this.handleKeyDown.bind(this))
      document.addEventListener("keyup", this.handleKeyUp.bind(this))
    }
    requestAnimationFrame(() => {this.loop()});
  }

  loop() {
    let {keyMap, shipRotation, shipRotationSpeed, shipSpeed, shipX, shipY} = this.state;
    let newRotation, newX, newY;
    if (keyMap[this.keys.up] && keyMap[this.keys.left]) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation - shipRotationSpeed)
      newX = shipX
      newY = shipY
    }
    else if (keyMap[this.keys.up] && keyMap[this.keys.right]) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newRotation = (shipRotation + shipRotationSpeed)
      newX = shipX
      newY = shipY
    } else if (keyMap[this.keys.left]) {
      newRotation = (shipRotation - shipRotationSpeed)
      newX = shipX
      newY = shipY
    }
    else if (keyMap[this.keys.right]) {
      newRotation = (shipRotation + shipRotationSpeed)
      newX = shipX
      newY = shipY
    }
    else if (keyMap[this.keys.up]) {
      let {shipX, shipY} = this.calcVector(shipSpeed, shipRotation)
      newX = shipX
      newY = shipY
    }

    if (keyMap[this.keys.right] || keyMap[this.keys.up] || keyMap[this.keys.left]) {
      this.setState({
        shipRotation: newRotation || shipRotation,
        shipX: newX || shipX,
        shipY: newY || shipY
      })
    }

    requestAnimationFrame(() => {this.loop()});

  }

  calcVector(speed, angle) {
    let {shipX, shipY} = this.state;
    return {
        shipY: shipY - (speed * Math.cos(angle * Math.PI / 180)),
        shipX: shipX + Math.floor((speed * Math.sin(angle * Math.PI / 180)))
    }
  }

  handleKeyUp (event) {
    var keyMap = {...this.state.keyMap}
    keyMap[event.keyCode] = (event.type == 'keydown');//false
    this.setState({keyMap})
  }

  handleKeyDown (event) {
    var keyMap = {...this.state.keyMap}
    keyMap[event.keyCode] = (event.type == 'keydown'); //true
    this.setState({keyMap})
  };

  moveLeftPress() {
    var keyMap = {...this.state.keyMap}
    keyMap[this.keys.left] = true
    this.setState({keyMap})
  }
  
  moveLeftRelease() {
    var keyMap = {...this.state.keyMap}
    keyMap[this.keys.left] = false
    this.setState({keyMap})
  }

  moveRightPress() {
    var keyMap = {...this.state.keyMap}
    keyMap[this.keys.right] = true
    this.setState({keyMap})
  }
  
  moveRightRelease() {
    var keyMap = {...this.state.keyMap}
    keyMap[this.keys.right] = false
    this.setState({keyMap})
  }

  moveUpPress() {
    var keyMap = {...this.state.keyMap}
    keyMap[this.keys.up] = true
    this.setState({keyMap})
  }
  
  moveUpRelease() {
    var keyMap = {...this.state.keyMap}
    keyMap[this.keys.up] = false
    this.setState({keyMap})
  }
  

  render() {
    return(
      <View style={{display:"flex", height:100, width:100}}>
      <View style={{display:"flex", flex:1, flexDirection:"row", alignSelf:"flex-start", alignItems:"center"}}>
        <View
          style={{flex:1, padding: 5, width: 50}}
          onTouchStart={() => this.moveLeftPress()}
          onTouchEnd={() => this.moveLeftRelease()}
        >
          <Text>Left</Text>
        </View>
        <View 
        style={{flex:1, padding: 5, width: 50}}
        onTouchStart={() => this.moveUpPress()}
        onTouchEnd={() => this.moveUpRelease()}
      >
        <Text>Forward</Text>
      </View>
        <View 
        style={{flex:1, padding: 5, width: 50}}
        onTouchStart={() => this.moveRightPress()}
        onTouchEnd={() => this.moveRightRelease()}
      >
        <Text>Right</Text>
      </View>
    </View>
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
    )
  }
}