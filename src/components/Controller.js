import React from 'react'
import { Image, View, PanResponder, StyleSheet, Animated} from 'react-native'

export default class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            scale: new Animated.Value(1),
        };
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gestureState) => {
                // Set the initial value to the current state
                this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
                this.state.pan.setValue({ x: 0, y: 0 });
                Animated.spring(
                    this.state.scale,
                    { toValue: 1.1, friction: 3 }
                ).start();
            },

            // When we drag/pan the object, set the delate to the states pan position
            onPanResponderMove: (e, gestureState) => {
                
                let {moveX, moveY} = gestureState

                if(moveX < 200 
                    && moveX > -200
                    && moveY < 600 
                    && moveY > -600) {
                    let up, left, right = false;
                    left = (moveX < 30)
                    right = (moveX > 100)
                    up  = (moveY < 400)
                    this.props.setParentState({
                        up,
                        left,
                        right
                    })
                    Animated.event([null, {
                        dx: this.state.pan.x,
                        dy: this.state.pan.y,
                    }])(e, gestureState);
                } else {
                    return;
                }
            },

            onPanResponderRelease: (e, { vx, vy }) => {
                // Flatten the offset to avoid erratic behavior
                this.state.pan.flattenOffset();
                this.props.setParentState({
                    up: false,
                    left: false,
                    right: false
                })
                Animated.spring(
                    this.state.scale,
                    { toValue: 1, friction: 3 }
                ).start();
                this.state.pan.setValue({ x: 0, y: 0 });
                
            }
        });
    }

    render() {
        // Destructure the value of pan from the state
        let { pan, scale } = this.state;

        // Calculate the x and y transform from the pan value
        let [translateX, translateY] = [pan.x, pan.y];


        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = { 
            position: "absolute",
            top: 400,
            left: 50,
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor: "red",
            borderRadius: 50
        };

        return (
                <Animated.View 
                    style={{
                        ...imageStyle,
                         margin: 20,
                         flex: 1,
                         borderRadius: 50,
                         width: 100,
                         height: 100,
                        }} 
                    {...this._panResponder.panHandlers} />
        );
    }

}

let styles = StyleSheet.create({
    circle: {
        flex: 1,
        borderRadius: 50,
        width: 100,
        height: 100,
    }
});