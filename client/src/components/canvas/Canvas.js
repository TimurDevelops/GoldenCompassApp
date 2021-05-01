import React, {useState} from 'react';
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";
import PropTypes from "prop-types";
import WorkingSpace from "./WorkingSpace";

const Canvas = ({drawWidth, drawColor}) => {

  return (
    <div id='mainCanvas' style={{background: '#ccc', width: '50vw', height: '50vh'}}>
      <P5Wrapper sketch={sketch} drawWidth={drawWidth} drawColor={drawColor}/>
    </div>
  )
}

WorkingSpace.propTypes = {
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired
}

export default Canvas;