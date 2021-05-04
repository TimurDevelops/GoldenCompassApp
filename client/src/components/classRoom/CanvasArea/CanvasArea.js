import React, {useState} from 'react';
import PropTypes from "prop-types";
import TipArea from "./TipArea";
import Canvas from "./Canvas/Canvas";
import ToolPanel from "./ToolPanel";

import "./CanvasArea.scss"

const CanvasArea = ({userType, tip, slideImg}) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');


  return (
    <div className={"canvas-area"}>
      {userType === 'teacher' ? <TipArea tip={tip}/> : ''}
      {slideImg}
      <Canvas drawWidth={drawWidth} drawColor={drawColor}/>
      <ToolPanel setDrawWidth={setDrawWidth} setDrawColor={setDrawColor}/>
    </div>
  )
}

CanvasArea.propTypes = {
  userType: PropTypes.string.isRequired,
  tip: PropTypes.string.isRequired,
  slideImg: PropTypes.string.isRequired,
}

export default CanvasArea;