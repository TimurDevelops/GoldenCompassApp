import React from "react";
import PropTypes from "prop-types";

import Chessboard from "./Chessboard";
import './Chessboard.scss'

const ChessboardSlide = ({room, visible}) => {

  return (
    <div className={`abacus-slide ${!visible ? 'hidden' : ''}`}>
      <Chessboard room={room}/>
    </div>
  );
}

ChessboardSlide.propTypes = {
  room: PropTypes.string.isRequired,
  visible: PropTypes.bool,
}

export default ChessboardSlide;