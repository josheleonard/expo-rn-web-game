import React from 'react';
import { Platform, Dimensions, Animated } from 'react-native';
import * as firebase from "firebase";

//Components
import styled from 'styled-components/native';
import Controller from './components/Controller';
import Ship from './components/Ship';
import Universe from './components/Universe';
import StartScreen from './components/StartScreen';

export default class App extends React.Component {
  constructor() {
    super()

    //check which OS (web, ios, android)
    this.OS = Platform.OS
    // Initialize Firebase
    let config = {
      apiKey: "AIzaSyCoNBpW8La0JLolHyY2RR1AkETbmgFaB38",
      authDomain: "blackholesandbarrelrolls.firebaseapp.com",
      databaseURL: "https://blackholesandbarrelrolls.firebaseio.com",
      projectId: "blackholesandbarrelrolls",
      storageBucket: "",
      messagingSenderId: "802173219020"
    };
    firebase.initializeApp(config);

    console.log("init")
    //anonymous sign-in for now
    firebase.auth().signInAnonymously().catch((error) => { console.error(error) });

    /*If the signInAnonymously method completes without error, 
    the observer registered in the onAuthStateChanged will trigger and you can get the 
    anonymous user's account data from the User object:*/
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        let {isAnonymous, uid} = user;
        console.log("logged in", {isAnonymous, uid})

        // track new user in the database
        this.newUserKey = uid
        firebase.database().ref('users').child(uid).push({
          x: 20,
          y: 20,
        })
      } else {
        // User is signed out.
        console.log("signed out")
      }
    });
    
    //do not update this object unless you need a re-render
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

    //watch delta timestamp values to buffer high-end cpus from over-rendering
    this.deltaTimeMs = 0;
    this.lastFrameTimeMs = 0;
  }
  
  //This function is called when the component is first rendered
  componentDidMount() {
    if (this.OS == "web") {
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
    //update x y and rotation in firebase
    firebase.database().ref('users/' + this.newUserKey).set({
      x,
      y,
      rotation
    });
    /*Animated.parallel([
      Animated.timing(// Animate value over time
        this.worldXY,// The value to drive
        {
          toValue: {x, y},// Animate to x y value
          duration: 14
        }
      ).start(),// Start the animation
      Animated.timing(this.shipRotation,{toValue: rotation, duration: 14}).start(),
    ])*/
    this.shipRotation.setValue(rotation);
    this.worldXY.setValue({x, y}) //still faster than using the Animated() animations
    
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

  shipControls = () => {
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
  }

  //Main Game Logic Loop
  loop = (timestamp) => {
    if(this.OS === "web") {
      //https://github.com/facebook/react-native/issues/16151
      //can only throttle on web due to timestamp issue on native
      //use delta time to throttle high-end cpus
      //setinal buffer
      this.deltaTimeMs += (timestamp - this.lastFrameTimeMs)
      this.lastFrameTimeMs = timestamp;
      while(this.deltaTimeMs >= 16) {
        this.deltaTimeMs -= 16;
      }
    }
    //check the keyboard and touch controller,
    //then move the ship if needed
    this.shipControls();

    requestAnimationFrame(this.loop); //Run loop code on every frame
  
  }

  //Takes keyboard events and updates controls
  handleKeyUp = (event) => this.keyMap[event.keyCode] = false
  handleKeyDown = (event) => this.keyMap[event.keyCode] = true

  render = () => {
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