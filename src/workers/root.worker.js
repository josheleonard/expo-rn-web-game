// import { createWorker, applyWorker } from 'redux-worker';

// //Reducer Imports
// import rootReducer from '../reducers/root.reducer';

// // Instantiate ReduxWorker
// let reduxWorker = createWorker();

// // Registering your reducer. 
// reduxWorker.registerReducer(rootReducer);

// reduxWorker.registerTask('KEY_DOWN', function(state, action) {
// 	console.log({action})
// });

// console.log({reduxWorker})

// export default reduxWorker;

self.onmessage = ({ data: action }) => { // `data` should be a FSA compliant action object.
  
	switch(action.type) {
		case "KEY_DOWN" :
			break;


		case "KEY_UP" :
			break;

		default: 
			self.postMessage({
			    type: action.type,
			    // Notice that we remove the `meta.WebWorker` field from the payload.
			    // Since the returned data will be dispatched as a new action and be passed through all the middlewares,
			    // keeping the `meta.WebWorker` field may cause an infinite loop.
			    payload: {
			      
			    },
			 });
			break;

	}



  self.postMessage({
    type: action.type,
    // Notice that we remove the `meta.WebWorker` field from the payload.
    // Since the returned data will be dispatched as a new action and be passed through all the middlewares,
    // keeping the `meta.WebWorker` field may cause an infinite loop.
    payload: {
      
    },
  });
};
