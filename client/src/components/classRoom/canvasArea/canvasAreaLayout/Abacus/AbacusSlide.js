import React from "react";

import './Abacus.scss'
import Abacus from "./Abacus";
import PropTypes from "prop-types";

const AbacusSlide = ({room, visible}) => {

  return (
    <div className={`abacus-slide ${!visible ? 'hidden' : ''}`}>
      <div className={"abacus-border"}>
        <div className={"border left"}/>
        <div className={"border right"}/>
        <div className={"border top"}/>
        <div className={"border bottom"}/>

        <Abacus room={room}/>
      </div>
    </div>
  );
}

AbacusSlide.propTypes = {
  room: PropTypes.string.isRequired,
  visible: PropTypes.bool,
}

export default AbacusSlide;