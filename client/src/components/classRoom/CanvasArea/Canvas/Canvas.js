import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

import "./Canvas.scss"

const Canvas = ({drawWidth, drawColor, teacherLogin, login, usertype, setAlert}) => {
  console.log(login, usertype)

  return (
    <div id='mainCanvas' className={"canvas"} style={{background: '#ccc', width: '50vw', height: '50vh'}}>
      <P5Wrapper
        sketch={sketch}
        drawWidth={drawWidth}
        drawColor={drawColor}
        login={login}
        teacherLogin={teacherLogin}
        usertype={usertype}
        setAlert={setAlert}
      />
    {/*  TODO сделать выход при несоблюдении условий */}
    </div>
  )
}

Canvas.propTypes = {
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
  login: PropTypes.string.isRequired,
  teacherLogin: PropTypes.string.isRequired,
  usertype: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
}

export default Canvas;
