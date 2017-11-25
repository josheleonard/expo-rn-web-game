//Dependancies
import React from 'react';
import { Platform, Dimensions, Animated, InteractionManager } from 'react-native';
import * as firebase from "firebase";
import styled from 'styled-components/native';
import ReactAnimationFrame from 'react-animation-frame';

//Components
import Controller from './components/Controller';
import Ship from './components/Ship';
import Universe from './components/Universe';
import StartScreen from './components/StartScreen';

class App extends React.Component {
  constructor() {
    
    super()

    this.OS = Platform.OS  //check which OS (web, ios, android)
    
    this.enemyShipKeys = [] // track other players' keys to add and remove listeners

    //Get and cache screen dimensions for use in object placement
    //and world scaling
    this.xBounds = [0, Dimensions.get('window').width];
    this.yBounds = [0, Dimensions.get('window').height];
    this.xCenter = this.xBounds[1]/2;
    this.yCenter = this.yBounds[1]/2;

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
        firebase.database().ref('users').child(uid).set({
          x: this.xCenter,
          y: this.yCenter,
          rotation: 0,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        })
      } else {
        // User is signed out.
        console.log("signed out")
      }
    });

    //Add newly joined players
    firebase.database().ref('users').on('child_added', (ship) => {
      console.log('childadded', ship.val())
      //skip player ship
      if (this.newUserKey !== ship.key) {
        //new ship has entered since start
        this.enemyShipKeys[ship.key] = ship.key;
        this.forceUpdate();
      }
    })

    //Add newly joined players
    firebase.database().ref('users').once('child_added', (ship) => {
      console.log('childadded', ship.val())
      //skip player ship
      if (this.newUserKey !== ship.key) {
        //new ship has entered since start
        this.enemyShipKeys[ship.key] = ship.key;
        this.forceUpdate();
      }
    })
    
    //do not update this object unless you need a re-render
    this.state = {
      screen: "Start"
    }

    //Ship Initial Stats
    this.shipRotationSpeed = 2;
    this.shipSpeed = 5;

    //Track animations outside of this.state 
    //to render only components monitoring the animation values
    this.shipRotation = new Animated.Value(36000);
    this.interpolatedShipRotation = this.shipRotation.interpolate({
      inputRange: [0, 360], outputRange: ['0deg', '360deg']
    })
    this.worldXY = new Animated.ValueXY({x: 0, y: 0});
    
    //Game controls
    this.keyMap = {} //which keys are down
    this.keys = { left: 37, right: 39, up: 38,} //which keys to track

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
    this.worldXY = new Animated.ValueXY({x: 0, y: 0});
    //this.startGameLoop();
  }

  //Update the screen dimensions. Called whenever browser window resizes.
  resizeScreen = () => {
    this.xBounds = [0, Dimensions.get('window').width];
    this.yBounds = [0, Dimensions.get('window').height];
    this.xCenter = this.xBounds[1]/2;
    this.yCenter = this.yBounds[1]/2;
    this.forceUpdate() // force call the render() function
  }

  //Main Game Logic Loop
  //This is an injected lifecylce hook method provided by 'react-animation-frame' Higher-Order-Component
  onAnimationFrame(timestamp, prevTimestamp) {
    console.log("engine loop")
    this.shipControls(); //first calculation

    //buffer for high-end cpus
    /*this.deltaTimeMs += (timestamp - prevTimestamp)
    while(this.deltaTimeMs >= 16) {
      //even slow cpus can crunch numbers fast,
      //track ship movement until the device can handle a render, then update
      this.shipControls();
      this.deltaTimeMs -= 16;
    }*/

    //render ship and world changes

    this.shipRotation.setValue(this.shipRotation._value);
    this.worldXY.setValue({x: this.worldXY.x._value, y: this.worldXY.y._value})

  }

  //A callback sent to the controller component so that it can update the controls
  setKeysFromController = ({up, left, right}) => {
    this.keyMap[this.keys.up] = up; 
    this.keyMap[this.keys.left] = left; 
    this.keyMap[this.keys.right] = right; 
  }

  //A callback to allow changing of game screens
  setGameScreen = (screen) => {
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

      default: /*cancelAnimationFrame(this.loopID);*/ break;
    } //done checking controls
  }

  /*startGameLoop = () => {
    (() => {
      const loop = (timestamp) => {
        if (this.OS !== "web") {
          let timestamp = performance.now();//replace requestAnimationFrame timestamp since it broken on android
        }

        this.shipControls(); //first calculation

        //buffer for high-end cpus
        this.deltaTimeMs += (timestamp - this.lastFrameTimeMs)
        this.lastFrameTimeMs = timestamp;
        while(this.deltaTimeMs >= 16) {
          //even slow cpus can crunch numbers fast,
          //track ship movement until the device can handle a render, then update
          this.shipControls();
          this.deltaTimeMs -= 16;
        }

        //render ship and world changes
        console.log("setValue")
        console.log({x: this.worldXY.x._value, y: this.worldXY.y._value})
        this.shipRotation.setValue(this.shipRotation._value);
        this.worldXY.setValue({x: this.worldXY.x._value, y: this.worldXY.y._value})

        //InteractionManager.runAfterInteractions(() => {
         this.loopID = requestAnimationFrame(loop);
        //})
      }
      loop();
    })(); //IIFE / closure for performance (reduce garbage collection time)
  }*/

  //Takes keyboard events and updates controls
  handleKeyUp = (event) => this.keyMap[event.keyCode] = false
  handleKeyDown = (event) => this.keyMap[event.keyCode] = true

  //Return an array of [newWorldX, newWorldY]
  calcVector = (speed, angle) => {
    return [
      this.worldXY.x._value - (speed * Math.sin(angle * Math.PI / 180)),
      this.worldXY.y._value + (speed * Math.cos(angle * Math.PI / 180)),
    ]
  }

  //Update's the world's (x,y) so it looks like the ship is moving
  //and also rotates the ship
  moveShip = (x, y, rotation) => {
    //update ship x y and rotation in firebase
    firebase.database().ref('users/' + this.newUserKey).set({
      x: this.xCenter - x,
      y: this.yCenter - y,
      rotation,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
    //animate the universe scroll and ship rotation
    // this.shipRotation.setValue(rotation);
    // this.worldXY.setValue({x: x, y: y,})
    this.shipRotation._value = rotation;
    this.worldXY.x._value = x;
    this.worldXY.y._value = y;
    //cancelAnimationFrame(this.loopID);
  }

  render = () => {
    console.log("app rendered")
        return <AppWrapper
          width={this.xBounds[1]}
          height={this.yBounds[1]}>
          <Universe 
            x={this.worldXY.x}
            y={this.worldXY.y}>
              {this.enemyShipKeys && Object.entries(this.enemyShipKeys).map(([key, ship]) => {
                if (ship !== this.newUserKey) {
                  return <Ship
                  key={key}
                  firebaseKey={ship}
                  width={100}
                  height={100}
                  isEnemy={true}/>
                } else {
                  console.log("skipped my ship")
                  return null;
                }
              }
            )}
          </Universe>
            
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
            rotation={this.interpolatedShipRotation}
            isEnemy={false}/>

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

//export default App;
export default ReactAnimationFrame(App, 16); //animate at a throttled rate of 16ms