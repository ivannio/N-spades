import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import authData from '../helpers/data/authData';
import playerData from "../helpers/data/playerData";
import scoreData from '../helpers/data/scoreData';
import Home from "../components/pages/Home/Home";
import SignInSignUp from "../components/pages/SignInSignUp/SignInSignUp";
import Game from "../components/pages/Game/Game";
import Scores from "../components/pages/Scores/Scores";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConnection from "../helpers/firebaseConnection";
import "./App.scss";

firebaseConnection.firebaseInit();

class App extends React.Component {
  state = {
    authed: false,
    firebaseUser: null,
    player: null,
    myHighScores: null,
    leaderboardScores: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {  
        user.getIdToken().then((token) => {
          sessionStorage.setItem("token", token);
          this.setState({ firebaseUser: user, authed: true });          
        });         
      } else {
        this.setState({ authed: false, player: null, firebaseUser: null, myHighScores: null });
      }
    });
    this.getLeaderboard();
  }

  getLeaderboard = () => {
    scoreData.getLeaderboard()
    .then((response) => this.setState({ leaderboardScores: response }))
    .catch((error) => console.log("error getting leaderboard", error))
  };

  componentDidUpdate(prevState) {
    if (this.state !== prevState) {
      if (this.state.authed && !prevState.authed) {
        if (this.state.firebaseUser !== null && this.state.player === null) {
          this.getPlayer(this.state.firebaseUser.uid);
        }    
      }
      if (this.state.player !== null && this.state.myHighScores === null) {
        this.getPlayerHighScores(this.state.player);
      }  
    }
  }

  getPlayer = (uid) => {
    playerData
      .getPlayerByFirebaseUid(uid)
      .then((response) => this.setState({ player: response}))
      .catch((error) => console.error("error getting user", error));
  };

  updateAppHighScores = () => {
    this.getPlayerHighScores(this.state.player);
    this.getLeaderboard();
 }

  getPlayerHighScores = (player) => {  
    scoreData.getHighScoresByPlayerId(player.id)
  .then((response) => this.setState({ myHighScores: response }))
  .catch((error) => console.log("error getting leaderboard", error))      
  };

  logOutUser = () => {
    authData.logOut();
  };

  render() {
    const { authed, player, leaderboardScores, myHighScores } = this.state;
    return (
      <Router>
        <Switch>          
          <Route path="/" exact render={() => (
          <Home authed={authed} logOutUser={this.logOutUser} player={player} />
           )} />
          <Route path="/game" render={() => (
          <Game authed={authed} logOutUser={this.logOutUser} player={player} updateAppHighScores={this.updateAppHighScores} myHighScores={myHighScores}/>
           )} />
           <Route path="/scores" render={() => (
          <Scores authed={authed} player={player} logOutUser={this.logOutUser} leaderboardScores={leaderboardScores} myHighScores={myHighScores}/>
           )} />
          <Route path="/sign-up">
            {authed ? (
              <Redirect to="/" authed={authed} logOutUser={this.logOutUser} player={player}/>
            ) : (
              <SignInSignUp></SignInSignUp>
            )}
          </Route>
        </Switch>   
      </Router>
    );
  }
};

export default App;
