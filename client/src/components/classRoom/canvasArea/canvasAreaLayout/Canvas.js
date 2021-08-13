import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";
import {useSocket} from "../../../../hooks/useSocket";

const Canvas = ({
                  room,
                  // TODO получать img и active из контекста

                  activeTool,
                  drawWidth,
                  drawColor,
                }) => {

  const {socket} = useSocket()

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
  activeTool: PropTypes.string.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,

  // TODO получать img и active из контекста
  img: PropTypes.string,
  active: PropTypes.bool.isRequired,
}

export default Canvas;

