import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

const Canvas = ({
                  socket,
                  room,

                  img,

                  active,
                  activeTool,
                  drawWidth,
                  drawColor,
                }) => {

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

export default Canvas;

Canvas.propTypes = {
  socket: PropTypes.object.isRequired,
  room: PropTypes.string.isRequired,
  img: PropTypes.string,

  active: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
}
