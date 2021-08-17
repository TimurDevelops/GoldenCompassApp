import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

import {useSocket} from "../../../../hooks/useSocket";

const Canvas = ({room, activeTool, drawWidth, drawColor, active, img}) => {
  const {socket} = useSocket();

  return (
    <div id='mainCanvas' className={"canvas"}
         style={{backgroundImage: img ? `url(${img})` : 'none'}}>
      <P5Wrapper
        sketch={sketch}
        socket={socket}
        room={room}

        active={active}
        activeTool={activeTool}
        drawWidth={drawWidth}
        drawColor={drawColor}
      />
    </div>
  )
}

Canvas.propTypes = {
  room: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
}

export default Canvas;

