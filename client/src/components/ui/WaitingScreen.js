import React from 'react';

import "./WaitingScreen.scss";
import PropTypes from "prop-types";
import GoBack from "./GoBack";

const WaitingScreen = ({message, active}) => {
  return (
    <div className={`waiting-screen ${!active ? 'hidden' : ''}`}>
      <div className={'title'}>{message ? message : 'Подождите, пожалуйста...'}</div>
      <GoBack/>
    </div>
  )
}

WaitingScreen.propTypes = {
  message: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

export default WaitingScreen;
