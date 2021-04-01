import React, {useState} from 'react';
// import PropTypes from "prop-types";
import P5Wrapper from 'react-p5-wrapper';
import sketch from './Sketch';


const Canvas = () => {

  const [color, setColor] = useState();

  const randomColor = () => {
    setColor([
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ])
  }
  console.log(color)
  return (
    <div id='mainCanvas' style={{background: '#ccc', width: '50vw', height: '50vh'}}>
      <button onClick={randomColor}>Random Color</button>
      <P5Wrapper sketch={sketch} color={color}/>
    </div>
  )
}

// Header.propTypes = {
//   logout: PropTypes.func.isRequired,
// }

export default Canvas;