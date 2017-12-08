export function keyUp(keys) {
	return {
		type: "KEY_UP",
		keys,
		/*meta: {
		    debounce: {
		    	time: 32//~2 frames
		    }
		},*/
	}
}

export function keyDown(keys) {
	return {
		type: "KEY_DOWN",
		keys,
		/*meta: {
		    debounce: {
		    	time: 32//~2 frames
		    }
		},*/
	}
}