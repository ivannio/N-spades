import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import playerData from "../helpers/data/playerData";
import scoreData from '../helpers/data/scoreData';
import Home from "../components/pages/Home/Home";
import SignInSignUp from "../components/pages/SignInSignUp/SignInSignUp";
import Game from "../components/pages/Game/Game";
import Scores from "../components/pages/Scores/Scores";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConnection from "../helpers/firebaseConnection";
import authData from '../helpers/data/authData';
import "./App.scss";

firebaseConnection.firebaseInit();

class App extends React.Component {
  state = {
    authed: false,
    firebaseUser: null,
    player: null,
    myHighScores: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ firebaseUser: user, authed: true });
        user.getIdToken().then((token) => {
          sessionStorage.setItem("token", token);
        });
        this.getPlayer(this.state.firebaseUser.uid)
      } else {
        this.setState({ authed: false, player: null, firebaseUser: null, myHighScores: null });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.player !== prevState.player) {
      this.getPlayerHighScores(this.state.player);
    }
  }

  getPlayer = (uid) => {
    playerData
      .getPlayerByFirebaseUid(uid)
      .then((response) => this.setState({ player: response }))
      .catch((error) => console.error("error getting user", error));
  };

  getPlayerHighScores = (player) => {  
    scoreData.getHighScoresByPlayerId(player.id)
  .then((response) => this.setState({ myHighScores: response }))
  .catch((error) => console.log("error getting leaderboard", error))      
  };

  logOutUser = () => {
    authData.logOut();
  };

  render() {
    const { authed, player, myHighScores } = this.state;

    return (
      authed && player === null ? <></> :
      <Router>
        <Switch>          
          <Route path="/" exact render={() => (
          <Home authed={authed} logOutUser={this.logOutUser} player={player} />
           )} />
          <Route path="/game" render={() => (
          <Game authed={authed} logOutUser={this.logOutUser} player={player}/>
           )} />
           <Route path="/scores" render={() => (
          <Scores authed={authed} player={player} myHighScores={myHighScores}/>
           )} />
          <Route path="/sign-up">
            {authed ? (
              <Redirect to="/" logOutUser={this.logOutUser} player={player}/>
            ) : (
              <SignInSignUp authed={authed}></SignInSignUp>
            )}
          </Route>
        </Switch>
      </Router>
    );
  }
};

export default App;
