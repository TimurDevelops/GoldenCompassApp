import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

const Canvas = ({
                  img,
                  setSlideImg,
                  drawWidth,
                  drawColor,
                  teacherLogin,
                  login,
                  usertype,
                  setAlert,
                  allowedStudent,
                  disallowToClassRoom,
                  setWaitingScreen,
                  activeTool,
                  allowStudentToDraw,
                }) => {

  return (
    <div id='mainCanvas' className={"canvas"}
         style={{backgroundImage: `url(${img})`}}>
      <P5Wrapper
        sketch={sketch}
        slideImg={img}
        setSlideImg={setSlideImg}
        drawWidth={drawWidth}
        drawColor={drawColor}
        login={login}
        teacherLogin={teacherLogin}
        usertype={usertype}
        allowedStudent={allowedStudent}
        setAlert={setAlert}
        disallowToClassRoom={disallowToClassRoom}
        setWaitingScreen={setWaitingScreen}
        activeTool={activeTool}
        allowStudentToDraw={allowStudentToDraw}
      />
    </div>
  )
}

export default Canvas;

Canvas.propTypes = {
  img: PropTypes.string.isRequired,
  setSlideImg: PropTypes.func.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
  login: PropTypes.string.isRequired,
  teacherLogin: PropTypes.string.isRequired,
  usertype: PropTypes.string.isRequired,
  allowedStudent: PropTypes.string,
  setAlert: PropTypes.func.isRequired,
  disallowToClassRoom: PropTypes.func.isRequired,
  setWaitingScreen: PropTypes.func.isRequired,
  activeTool: PropTypes.string.isRequired,
  allowStudentToDraw: PropTypes.bool.isRequired,
}