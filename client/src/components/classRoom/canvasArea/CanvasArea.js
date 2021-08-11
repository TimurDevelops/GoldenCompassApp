import React, {useState} from 'react';
import PropTypes from "prop-types";
import TipArea from "./TipArea";
import Canvas from "./Canvas/Canvas";
import ToolPanel from "./ToolPanel";

import {TOOLS} from "../../../utils/types";

const CanvasArea = ({
                      userLogin,
                      userType,
                      teacherLogin,
                      slide: {img, tip},
                      allowedStudent,
                      disallowToClassRoom,
                      setWaitingScreen,
                      setAlert,
                    }) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');
  const [activeTool, setActiveTool] = useState(TOOLS.DEFAULT);
  const [allowStudentToDraw, setStudentAllowedToDraw] = useState(true);


  if (!img){

  }

  return (
    <div className={"canvas-area"}>

      {/*{userType === 'teacher' ? <TipArea tip={tip}/> : ''}*/}


      {/*{img ? img : ''}*/}
      {/*<Canvas*/}
      {/*  drawWidth={drawWidth}*/}
      {/*  drawColor={drawColor}*/}
      {/*  login={userLogin}*/}
      {/*  teacherLogin={teacherLogin}*/}
      {/*  usertype={userType}*/}
      {/*  allowedStudent={allowedStudent}*/}
      {/*  setAlert={setAlert}*/}
      {/*  disallowToClassRoom={disallowToClassRoom}*/}
      {/*  setWaitingScreen={setWaitingScreen}*/}
      {/*  activeTool={activeTool}*/}
      {/*  allowStudentToDraw={allowStudentToDraw}*/}
      {/*/>*/}
      {/*{userType === 'teacher' ?*/}
      {/*  <ToolPanel*/}
      {/*    drawColor={drawColor}*/}
      {/*    setActiveTool={setActiveTool}*/}
      {/*    setDrawWidth={setDrawWidth}*/}
      {/*    setDrawColor={setDrawColor}*/}
      {/*    setStudentAllowedToDraw={setStudentAllowedToDraw}*/}
      {/*  /> : ''}*/}
    </div>
  )
}

CanvasArea.propTypes = {
  userLogin: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  teacherLogin: PropTypes.string,
  slide: PropTypes.object.isRequired,
  allowedStudent: PropTypes.string,
  disallowToClassRoom: PropTypes.func.isRequired,
  setWaitingScreen: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
}

CanvasArea.defaultProps = {
  slide: {},
}

export default CanvasArea;