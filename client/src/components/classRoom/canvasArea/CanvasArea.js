import React, {useContext, useState} from 'react';
import PropTypes from "prop-types";

import TipArea from "./canvasAreaLayout/TipArea";
import Canvas from "./canvasAreaLayout/Canvas";
import ToolPanel from "./canvasAreaLayout/ToolPanel";

import {TOOLS} from "../../../utils/types";

import {useUser} from "../../../hooks/useUser";
import {TeacherContext} from "../../../context/TeacherContext";
import {StudentContext} from "../../../context/StudentContext";

import './CanvasArea.scss'

const CanvasArea = ({room, sidebarOpen}) => {

  const {user: {type: usertype}} = useUser();
  const {slide: teacherContextSlide} = useContext(TeacherContext)
  const {slide: studentContextSlide, allowedToDraw: contextAllowedToDraw} = useContext(StudentContext)

  const { img, tip, hasAbacus } = usertype === 'teacher' ? teacherContextSlide : studentContextSlide;

  const allowedToDraw = usertype === 'teacher' ? true : contextAllowedToDraw;

  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');
  const [activeTool, setActiveTool] = useState(TOOLS.DEFAULT);

  return (
    <div className={"canvas-area"}>
      <TipArea tip={tip}/>

      <Canvas
        room={room}
        img={img}
        hasAbacus={hasAbacus}
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