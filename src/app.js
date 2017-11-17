import React from 'react';
import { Platform, Dimensions, Animated } from 'react-native';
import styled from 'styled-components/native';
import Controller from './components/Controller';
import Ship from './components/Ship';
import Universe from './components/Universe';
import StartScreen from './components/StartScreen';

export default class App extends React.Component {
  constructor() {
    super()
    //do not update thisobject unless you need a re-render
    this.state = {
      screen: "Start"
    }
    //constants
    this.shipRotationSpeed = 5;
    this.shipSpeed = 15;

    //Track animations outside of this.state 
    //to render only components monitoring the animation values
    this.shipRotation = new Animated.Value(36000);
    this.interpolatedShipRotation = this.shipRotation.interpolate({
      inputRange: [0, 360], outputRange: ['0deg', '360deg']
    })
    this.worldXY = new Animated.ValueXY({x: -10000, y: -10000});
    
    this.keyMap = {} //which keys are down
    this.keys = { left: 37, right: 39, up: 38,} //which keys to track

    //Get and cache screen dimensions for use in object placement
    //and world scaling
    this.xBounds = [0, Dimensions.get('window').width];
    this.yBounds = [0, Dimensions.get('window').height];
    this.xCenter = this.xBounds[1]/2;
    this.yCenter = this.yBounds[1]/2;
  }
  
  //This function is called when the component is first rendered
  componentDidMount() {
    if (Platform.OS == "web") {
      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
      document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }
    Dimensions.addEventListener("change", () => this.resizeScreen());
    requestAnimationFrame(this.loop);
  }

  //Update the screen dimensions. Called whenever browser window resizes.
  resizeScreen = () => {
    this.xBounds = [0, Dimensions.get('window').width];
    this.yBounds = [0, Dimensions.get('window').height];
    this.xCenter = this.xBounds[1]/2;
    this.yCenter = this.yBounds[1]/2;
    this.forceUpdate() // force call the render() function
  }

  //Return an array of [x, y]
  calcVector = (speed, angle) => {
    return [
      this.worldXY.x._value - (speed * Math.sin(angle * Math.PI / 180)),
      this.worldXY.y._value + (speed * Math.cos(angle * Math.PI / 180)),
    ]
  }

  //Update's the world's (x,y) so it looks like the ship is moving
  //and also rotates the ship
  moveShip = (x, y, rotation) => {
    this.worldXY.setValue({x, y})
    this.shipRotation.setValue(rotation)
  }

  //A callback sent to the controller component so that it can update the controls
  setKeysFromController = ({up, left, right}) => {
    this.keyMap[this.keys.up] = up; 
    this.keyMap[this.keys.left] = left; 
    this.keyMap[this.keys.right] = right; 
  }

  //A callback to allow changing of game screens
  setGameScreen = (screen) => {
    console.log(screen)
    this.setState({screen});
  }

  //Main Game Logic Loop
  loop = () => {
    //check the keyboard and touch controller,
    //then move the ship if needed
    switch(true) {

      case this.keyMap[this.keys.up] && this.keyMap[this.keys.right]: 
        this.moveShip(
          ...this.calcVector(this.shipSpeed, this.shipRotation._value),
          (this.shipRotation._value + this.shipRotationSpeed)
        )
        break;

      case this.keyMap[this.keys.up] && this.keyMap[this.keys.left]: 
        this.moveShip(
          ...this.calcVector(this.shipSpeed, this.shipRotation._value),
          (this.shipRotation._value - this.shipRotationSpeed)
        )
        break;

      case this.keyMap[this.keys.left]: 
        this.moveShip(
          this.worldXY.x._value,
          this.worldXY.y._value,
          (this.shipRotation._value - this.shipRotationSpeed)
        )
        break;

      case this.keyMap[this.keys.right]:
        this.moveShip(
          this.worldXY.x._value,
          this.worldXY.y._value,
          (this.shipRotation._value + this.shipRotationSpeed)
        )
        break;

      case this.keyMap[this.keys.up]:
        this.moveShip(
          ...this.calcVector(this.shipSpeed, this.shipRotation._value),
          this.shipRotation._value
        )
        break

      default: break;
    } //done checking controls

    requestAnimationFrame(this.loop); //Run loop code on every frame
  
  }

  //Takes keyboard events and updates controls
  handleKeyUp = (event) => this.keyMap[event.keyCode] = false
  handleKeyDown = (event) => this.keyMap[event.keyCode] = true

  render = () => {
    switch(this.state.screen) {
      case "Game" :
        return <AppWrapper
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
            width={100}
            height={100}
            y={this.yCenter}
            x={this.xCenter}
            rotation={this.interpolatedShipRotation}/>
            
          

        </AppWrapper>
      
      case "Start" : return <StartScreen startClicked={() => {this.setGameScreen("Game")}}/>

      default: <View>Screen Not Found</View>
    }
  }
}

//CSS
const AppWrapper = styled.View`
  display: flex;
  flex: 1;
  height: ${ props => props.width };
  width: ${ props => props.width };
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