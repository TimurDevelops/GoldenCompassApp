import React, {useState} from 'react';
import TipArea from "./TipArea";
import Canvas from "./Canvas";
import ToolPanel from "./ToolPanel";

import PropTypes from "prop-types";

const WorkingSpace = ({userType, tip, slideImg}) => {
  const [drawWidth, setDrawWidth] = useState(10);
  const [drawColor, setDrawColor] = useState('red');


  return (
    <div>
      {userType === 'teacher' ? <TipArea tip={tip}/> : ''}
      {slideImg}
      <Canvas drawWidth={drawWidth} drawColor={drawColor}/>
      <ToolPanel setDrawWidth={setDrawWidth} setDrawColor={setDrawColor}/>
    </div>
  )
}

WorkingSpace.propTypes = {
  userType: PropTypes.string.isRequired,
  tip: PropTypes.string.isRequired,
  slideImg: PropTypes.string.isRequired,
}

export default WorkingSpace;