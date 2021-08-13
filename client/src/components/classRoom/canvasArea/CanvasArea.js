import React, {useState} from 'react';
import PropTypes from "prop-types";

import TipArea from "./canvasAreaLayout/TipArea";
import Canvas from "./canvasAreaLayout/Canvas";
import ToolPanel from "./canvasAreaLayout/ToolPanel";

import {TOOLS} from "../../../utils/types";

import './CanvasArea.scss'

const CanvasArea = ({
                      room,
                      sidebarOpen,
                    }) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');
  const [activeTool, setActiveTool] = useState(TOOLS.DEFAULT);
  // TODO получать slide из context


  return (
    <div className={"canvas-area"}>
      // TODO получать userType из useUser
      <TipArea tip={tip}/>

      <Canvas
        room={room}
        img={img}
        // TODO получать из контекста allowedToDraw
        active={sidebarOpen && allowedToDraw}
        activeTool={activeTool}
        drawWidth={drawWidth}
        drawColor={drawColor}
      />

      <ToolPanel
        drawColor={drawColor}
        setActiveTool={setActiveTool}
        setDrawWidth={setDrawWidth}
        setDrawColor={setDrawColor}
      />
    </div>
  )
}

CanvasArea.propTypes = {
  room: PropTypes.string.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
}

export default CanvasArea;