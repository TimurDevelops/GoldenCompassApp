import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

import "./Canvas.scss"

const Canvas = ({drawWidth, drawColor}) => {

  return (
    <div id='mainCanvas' className={"canvas"} style={{background: '#ccc', width: '50vw', height: '50vh'}}>
      <P5Wrapper sketch={sketch} drawWidth={drawWidth} drawColor={drawColor}/>
    </div>
  )
}

Canvas.propTypes = {
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired
}

export default Canvas;