import React, {useState} from 'react';
import PropTypes from "prop-types";
import TipArea from "./TipArea";
import Canvas from "./Canvas/Canvas";
import ToolPanel from "./ToolPanel";

import "./CanvasArea.scss"

const CanvasArea = ({
                      userLogin, userType, teacherLogin, tip, slideImg, setAlert, allowedStudent, disallowToClassRoom,
                      setWaitingScreen
                    }) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');
  const [activeTool, setActiveTool] = useState('pencil');
  const [allowStudentToDraw, setStudentAllowedToDraw] = useState(true);
  const undo = () => {
    setAlert('В разработке', 'danger')
  };

  return (
    <div className={"canvas-area"}>
      {userType === 'teacher' ? <TipArea tip={tip}/> : ''}
      {slideImg}
      <Canvas
        drawWidth={drawWidth}
        drawColor={drawColor}
        login={userLogin}
        teacherLogin={teacherLogin}
        usertype={userType}
        allowedStudent={allowedStudent}
        setAlert={setAlert}
        disallowToClassRoom={disallowToClassRoom}
        setWaitingScreen={setWaitingScreen}
        activeTool={activeTool}
        allowStudentToDraw={allowStudentToDraw}
      />
      {userType === 'teacher' ?
        <ToolPanel
          setActiveTool={setActiveTool}
          setDrawWidth={setDrawWidth}
          setDrawColor={setDrawColor}
          setStudentAllowedToDraw={setStudentAllowedToDraw}
          undo={undo}
         /> : ''}
    </div>
  )
}

CanvasArea.propTypes = {
  userLogin: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  allowedStudent: PropTypes.string,
  teacherLogin: PropTypes.string.isRequired,
  tip: PropTypes.string.isRequired,
  slideImg: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
  disallowToClassRoom: PropTypes.func.isRequired,
  setWaitingScreen: PropTypes.func.isRequired,
}

export default CanvasArea;