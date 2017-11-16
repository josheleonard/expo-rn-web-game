import React from 'react'
import { Image, View, PanResponder, StyleSheet, Animated} from 'react-native'

export default class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            scale: new Animated.Value(1),
        };

        this.pan = new Animated.ValueXY();
        this.scale = new Animated.Value(1);

    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, gestureState) => {
                // Set the initial value to the current state
                this.pan.setOffset({ x: this.pan.x._value, y: this.pan.y._value });
                this.pan.setValue({ x: 0, y: 0 });
                Animated.spring(
                    this.scale,
                    { toValue: 1.1, friction: 3 }
                ).start();
            },

            // When we drag/pan the object, set the delate to the states pan position
            onPanResponderMove: (e, gestureState) => {
                
                let {moveX, moveY, dx, dy} = gestureState

                let { x, y, width, height } = this.props;
                //contrain the movement to bounds        
                if(    dx < width*2 
                    && dx > -width*2 
                    && dy < height*2 
                    && dy > -height*2) {

                    let up, left, right = false;
                    left = (dx < (-width/3))
                    right = (dx > (width/3))
                    up  = (dy < (-height/3))
                    this.props.setKeys({
                        up,
                        left,
                        right
                    })
                    Animated.event([null, {
                        dx: this.pan.x,
                        dy: this.pan.y,
                    }])(e, gestureState);
                } else {
                    return;
                }
            },

            onPanResponderRelease: (e, { vx, vy }) => {
                // Flatten the offset to avoid erratic behavior
                this.pan.flattenOffset();
                this.props.setKeys({
                    up: false,
                    left: false,
                    right: false
                })
                Animated.spring(
                    this.scale,
                    { toValue: 1, friction: 3 }
                ).start();
                this.pan.setValue({ x: 0, y: 0 });
                
            }
        });
    }

    render() {
        // Destructure the value of pan from the state
        let pan = this.pan;
        let scale = this.scale;
        let { x, y, width, height } = this.props;

        // Calculate the x and y transform from the pan value
        let [translateX, translateY] = [pan.x, pan.y];


        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let controllerStyle = { 
            position: "absolute",
            top: y,
            left: x,
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor: "red",
            borderRadius: 50,
            zIndex: 3000 
        };

        return (
                <Animated.View 
                    style={{
                        ...controllerStyle,
                         borderRadius: 50,
                         width,
                         height,
                         zIndex: 5000,
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