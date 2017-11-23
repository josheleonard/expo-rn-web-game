import React from 'react'
import {View, Text, TouchableHighlight} from 'react-native'

StartScreen = ({startClicked}) =>
    <View 
        style={{
            flex:1,
            alignItems: "center",
            margin: 40
        }}    
    >
           <TouchableHighlight onPress={() => {
                    console.log("clicked");
                    startClicked()
                }
            }>
                <Text>Start</Text>
            </TouchableHighlight>
    </View>

export default StartScreen