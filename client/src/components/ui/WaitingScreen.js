import React from 'react';

import "./WaitingScreen.scss";
import PropTypes from "prop-types";
import GoBack from "./GoBack";

const WaitingScreen = ({message}) => {
  return (
    <div className={'waiting-screen'}>
      <div className={'title'}>{message ? message : 'Подождите, пожалуйста...'}</div>
      <GoBack/>
    </div>
  )
}

WaitingScreen.propTypes = {
  message: PropTypes.string.isRequired,
};

export default WaitingScreen;
