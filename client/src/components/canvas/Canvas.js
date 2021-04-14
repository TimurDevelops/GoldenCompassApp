import React, {useState} from 'react';
// import PropTypes from "prop-types";
import P5Wrapper from 'react-p5-wrapper';
import sketch from './Sketch';


const Canvas = () => {

  const [drawWidth, setDrawWidth] = useState(10);

  return (
    <div id='mainCanvas' style={{background: '#ccc', width: '50vw', height: '50vh'}}>
      <select value={drawWidth} onChange={e => setDrawWidth(e.target.value)}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={150}>150</option>
      </select>
      <P5Wrapper sketch={sketch} drawWidth={drawWidth}/>
    </div>
  )
}

// Header.propTypes = {
//   logout: PropTypes.func.isRequired,
// }

export default Canvas;