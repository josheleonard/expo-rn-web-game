import { createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createDebounce from 'redux-debounced';
import * as firebase from 'firebase';

import {signIn} from './actions/user.actions';


//import { createWorker, applyWorker } from 'redux-worker';

//reducer and worker imports
import rootReducer from './reducers/root.reducer';

// import reduxWorker from './workers/root.worker';
// const worker = new Worker('./web/dist/worker.bundle.js');
// console.log({worker})

//const RootWorker = require('worker-loader!./workers/root.worker'); // webpack's worker-loader
//const rootWorker = new RootWorker;

//console.log(rootWorker)

//const workerMiddleware = createWorkerMiddleware(rootWorker);
const debouncer = createDebounce()

//Custom middleware
import controllerMiddleware from './middleware/controller.middleware';



// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(
	
	rootReducer,
	
	{/*default state*/},

	composeWithDevTools(
	  	applyMiddleware(
	  		controllerMiddleware,
	  		debouncer,
	  		thunk,
	  		//workerMiddleware
	  	),
	  	//applyWorker(worker)
	)
);

//allow hot module reloading of reducer files
/*if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers').default)
    );
  }*/

console.log({store})

let state = store.getState();

//state
let screenWidth = state.screen.width;
let screenHeight = state.screen.height;


//put ship keys in redux store
let ENEMY_SHIP_ADDED = "ENEMY_SHIP_ADDED";

//firebase configuration
let config = {
  apiKey: "AIzaSyCoNBpW8La0JLolHyY2RR1AkETbmgFaB38",
  authDomain: "blackholesandbarrelrolls.firebaseapp.com",
  databaseURL: "https://blackholesandbarrelrolls.firebaseio.com",
  projectId: "blackholesandbarrelrolls",
  storageBucket: "",
  messagingSenderId: "802173219020"
};

// Initialize Firebase w/ config
firebase
.initializeApp(config);

let uid;

//tracks the client's firebase user id
//anonymous sign-in for now
firebase
.auth()
.signInAnonymously()
.catch((error) => { 
    console.error(error)
});

//Now that we are logging in,
// spawn a ship and let firebase know that we spawned in the center of our screen 



/*If the signInAnonymously method completes without error, 
the observer registered in the onAuthStateChanged will trigger and you can get the 
anonymous user's account data from the User object:*/
firebase
.auth()
.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    store.dispatch(signIn(user.uid))
    uid = user.uid;
    // track new user in the database
    firebase.database().ref('users').child(uid).set({
      x: screenWidth/2,
      y: screenHeight/2,
      rotation: 0,
      updatedAt: TIMESTAMP,
    })
  } else {
    // User is signed out.
  }
});

//Add newly joined players (when they appear)
firebase
.database()
.ref('users')
.on('child_added', (ship) => {
  if (uid !== ship.key) {//only update enemies
    //this.enemyShipKeys[ship.key] = ship.key;
    store.dispatch({
      type: "ENEMY_SHIP_ADDED",
      ship
    })
  }
})

//Add currently joined players
firebase
.database()
.ref('users')
.once('child_added', (ship) => {
  if (uid !== ship.key) {//only update enemies
    //this.enemyShipKeys[ship.key] = ship.key;
    store.dispatch({
      type: "ENEMY_SHIP_ADDED",
      ship
    })
  }
})


console.log({uid})

//export the database and authorization helpers for use elsewhere
export const db = firebase.database
export const auth = firebase.auth
export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP
export default store;
