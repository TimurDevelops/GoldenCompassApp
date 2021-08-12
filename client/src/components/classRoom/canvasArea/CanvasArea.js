import React, {useState} from 'react';
import PropTypes from "prop-types";

import TipArea from "./TipArea";
import Canvas from "./Canvas";
import ToolPanel from "./ToolPanel";

import {TOOLS} from "../../../utils/types";

import './CanvasArea.scss'

const CanvasArea = ({
                      userLogin,
                      canvasActive,
                      userType,
                      teacherLogin,
                      slide,
                      setSlideImg,
                      allowedStudent,
                      disallowToClassRoom,
                      setAllowedStudent,
                      setWaitingScreen,
                      setAlert,
                    }) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');
  const [activeTool, setActiveTool] = useState(TOOLS.DEFAULT);
  const [allowedToDraw, setAllowedToDraw] = useState(true);
  const [resetStudentCanvasFlag, setResetStudentCanvasFlag] = useState(true);

  const toggleResetStudentCanvasFlag = () => {
    setResetStudentCanvasFlag(!resetStudentCanvasFlag)
  }

  // if (!slide.img) {
  //   return (
  //     <div className={"canvas-area"}/>
  //   )
  // }

  const {img, tip} = slide || {};

  return (
    <div className={"canvas-area"}>

      <TipArea tip={tip} displayTip={userType === 'teacher'}/>

      <Canvas
        img={img}
        active={canvasActive && allowedToDraw}
        setSlideImg={setSlideImg}
        drawWidth={drawWidth}
        drawColor={drawColor}
        login={userLogin}
        teacherLogin={teacherLogin}
        usertype={userType}
        allowedStudent={allowedStudent}
        setAlert={setAlert}
        disallowToClassRoom={disallowToClassRoom}
        setAllowedStudent={setAllowedStudent}
        setWaitingScreen={setWaitingScreen}
        activeTool={activeTool}
        isStudentAllowedToDraw={allowedToDraw}
        resetStudentCanvas={resetStudentCanvasFlag}
      />

      <ToolPanel
        displayTeacherTools={userType === 'teacher'}
        drawColor={drawColor}
        setActiveTool={setActiveTool}
        setDrawWidth={setDrawWidth}
        setDrawColor={setDrawColor}
        setStudentAllowedToDraw={setAllowedToDraw}
        toggleResetStudentCanvasFlag={toggleResetStudentCanvasFlag}
      />
    </div>
  )
}

CanvasArea.propTypes = {
  userLogin: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  teacherLogin: PropTypes.string,

  slide: PropTypes.object.isRequired,

  canvasActive: PropTypes.bool.isRequired,
  setSlideImg: PropTypes.func.isRequired,
  allowedStudent: PropTypes.string,
  disallowToClassRoom: PropTypes.func.isRequired,
  setAllowedStudent: PropTypes.func.isRequired,
  setWaitingScreen: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
}

export default CanvasArea;