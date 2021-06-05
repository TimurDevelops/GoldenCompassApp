import React, {useState} from 'react';
import PropTypes from "prop-types";
import TipArea from "./TipArea";
import Canvas from "./Canvas/Canvas";
import ToolPanel from "./ToolPanel";

import "./CanvasArea.scss"

const CanvasArea = ({userLogin, userType, teacherLogin, tip, slideImg, setAlert}) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');

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
        setAlert={setAlert}
      />
      <ToolPanel setDrawWidth={setDrawWidth} setDrawColor={setDrawColor}/>
    </div>
  )
}

CanvasArea.propTypes = {
  userLogin: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  teacherLogin: PropTypes.string.isRequired,
  tip: PropTypes.string.isRequired,
  slideImg: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
}

export default CanvasArea;