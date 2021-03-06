import React from "react";
import { Link } from "react-router-dom";
import { Page, Col, Row, Fab, Icon, ProgressCircular } from "react-onsenui";
import ParticlesBg from "particles-bg";
import icon from '../../../assets/icon';
import goldIcon from '../../../assets/goldIcon';
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import "./Home.scss";

class Home extends React.Component {
  render() {
    const { authed, myHighScores, gilded } = this.props;
    const config = {
      num: [2],
      rps: 0.9,
      radius: [1, 2],
      life: [1.5, 5],
      v: [1, 3],
      tha: [-50, 50],
      alpha: [0.5, 0],
      scale: [.05, .09],
      body: gilded ? goldIcon : icon, 
      position: "all",
      cross: "bound",
      random: 1,
      g: 2,
    }; 
    return (
      <Page>
        { authed && myHighScores === null ? <Col className="loader-container">
            <ProgressCircular
              className="loading-circle"
              modifier="material"
              indeterminate
            />
          </Col> : <><Col className="home-header-column">
        <div className="mixnmatch-logo"></div>
      </Col>
      <Col className="home-buttons-column">
        <Row className="home-row">
          <Link className="primary-button button button--material" to={"/game"}>         
              {authed ? "Play" : "Play Logged Out"}        
          </Link>
        </Row>
        { authed ? <Row className="home-row">
          <Link className="custom-button button button--material" to={"/scores"}>
            View High Scores
          </Link>
        </Row> : <><div className="or">or</div>
          <Row className="home-row">
          <Link className="custom-button button button--material" to={"/sign-up"}>
            Login / Create Account
          </Link>
        </Row>
        <Row className="home-row">
          <Link className="custom-button button button--material" to={"/scores"}>
            View High Scores
          </Link>
        </Row></>
        }      
      </Col>
      { authed ? <>
      <h5 className='logout-fab-label'>Logout</h5>
      <Fab onClick={this.props.logOutUser} className='logout-fab' modifier='mini' position='top right'>
      <Icon  icon='fa-sign-out-alt' className='logout-fab-icon' />
   </Fab></> : '' }
      <ParticlesBg type="custom" config={config} bg={true} /> </> }   
          
      </Page>
    );
  }
}

export default Home;
