import React, {useState} from 'react';
import PropTypes from "prop-types";

import TipArea from "./TipArea";
import Canvas from "./Canvas";
import ToolPanel from "./ToolPanel";

import {TOOLS} from "../../../utils/types";

import './CanvasArea.scss'

const CanvasArea = ({
                      socket,
                      room,

                      slide,

                      canvasActive,
                      userType,
                      setAlert
                    }) => {

  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');
  const [activeTool, setActiveTool] = useState(TOOLS.DEFAULT);
  const [allowedToDraw, setAllowedToDraw] = useState(true);

  const studentAllowedToDrawChanged = (value) => {
    socket.emit("allowStudentToDraw", {teacherLogin: room, allowStudentToDraw: value});
  }

  socket.on('allowToDraw', ({allowStudentToDraw}) => {
    if (allowStudentToDraw) setAlert("Вы можете рисовать")
    else setAlert("Учитель отключил вам возможность рисовать")

    setAllowedToDraw(allowStudentToDraw);
  })


  const {img, tip} = slide || {};
  return (
    <div className={"canvas-area"}>

      <TipArea tip={tip} displayTip={userType === 'teacher'}/>

      <Canvas
        socket={socket}
        room={room}

        img={img}

        active={canvasActive && allowedToDraw}
        activeTool={activeTool}
        drawWidth={drawWidth}
        drawColor={drawColor}
      />

      <ToolPanel
        displayTeacherTools={userType === 'teacher'}
        drawColor={drawColor}
        setActiveTool={setActiveTool}
        setDrawWidth={setDrawWidth}
        setDrawColor={setDrawColor}
        setStudentAllowedToDraw={studentAllowedToDrawChanged}
      />
    </div>
  )
}

CanvasArea.propTypes = {
  socket: PropTypes.object.isRequired,
  room: PropTypes.string.isRequired,

  slide: PropTypes.object.isRequired,

  canvasActive: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
}

export default CanvasArea;