//Dependancies
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {connect} from 'react-redux';

//Components
import Controller from './components/Controller';
import EnemyShip from './components/EnemyShip';
import PlayerShip from './components/PlayerShip';
import Universe from './components/Universe';
import StartScreen from './components/StartScreen';

//actions
import * as playerShipActions from './actions/playerShip.actions';
import * as screenActions from './actions/screen.actions';

//firebase
import {db, PLAYER_UID} from './createReduxStore';

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  
  //This function is called when the component is first rendered
  componentDidMount() {
    Dimensions.addEventListener("change", () => this.props.resizeScreen(
      Dimensions.get('window').width,
      Dimensions.get('window').height
    ));
  }

  render() {
        return <AppWrapper
          width={this.props.screen.xBounds[1]}
          height={this.props.screen.yBounds[1]}>
          <Universe 
            x={0}
            y={0}>
              {this.props.enemyShipKeys && Object.entries(this.props.enemyShipKeys).map(([key, ship]) => {
                if (ship.key !== PLAYER_UID) {
                  return <EnemyShip
                  key={ship.key}
                  firebaseKey={ship.key}
                  width={100}
                  height={100}
                  x={ship.val().x}
                  y={ship.val().y}
                  rotation={ship.val().rotation}
                  />
                } else {
                  console.log("skipped my ship")
                  return null;
                }
              }
            )}
          </Universe>
            
          <Controller
            height={100}
            width={100}
            y={this.props.screen.yBounds[1] - 140}
            x={this.props.screen.xBounds[0] + 40}
          />

          <PlayerShip
            width={100}
            height={100}
            y={this.props.screen.yCenter}
            x={this.props.screen.xCenter}
          />

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

//redux mappings
const mapStateToProps = state => ({
  enemyShipKeys: state.enemyShips,
  screen: state.screen
})

export default connect(mapStateToProps, null)(App);