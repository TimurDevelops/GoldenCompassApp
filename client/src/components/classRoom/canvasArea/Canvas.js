import React from 'react';
import PropTypes from "prop-types";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./Sketch";

const Canvas = ({
                  img,
                  active,

                  setSlideImg,
                  drawWidth,
                  drawColor,
                  teacherLogin,
                  login,
                  usertype,
                  setAlert,
                  allowedStudent,
                  disallowToClassRoom,
                  setAllowedStudent,
                  setWaitingScreen,
                  activeTool,
                  isStudentAllowedToDraw,
                  resetStudentCanvas,
                }) => {

  return (
    <div id='mainCanvas' className={"canvas"}
         style={{backgroundImage: img ? `url(${img})` : 'none'}}>
      <P5Wrapper
        sketch={sketch}
        slideImg={img}
        setSlideImg={setSlideImg}
        active={active}
        activeTool={activeTool}
        drawWidth={drawWidth}
        drawColor={drawColor}
        login={login}
        teacherLogin={teacherLogin}
        usertype={usertype}
        allowedStudent={allowedStudent}
        setAlert={setAlert}
        disallowToClassRoom={disallowToClassRoom}
        setAllowedStudent={setAllowedStudent}
        setWaitingScreen={setWaitingScreen}
        isStudentAllowedToDraw={isStudentAllowedToDraw}
        resetStudentCanvas={resetStudentCanvas}
      />
    </div>
  )
}

export default Canvas;

Canvas.propTypes = {
  img: PropTypes.string,
  active: PropTypes.bool.isRequired,
  setSlideImg: PropTypes.func.isRequired,
  drawWidth: PropTypes.number.isRequired,
  drawColor: PropTypes.string.isRequired,
  login: PropTypes.string.isRequired,
  teacherLogin: PropTypes.string.isRequired,
  usertype: PropTypes.string.isRequired,
  allowedStudent: PropTypes.string,
  setAlert: PropTypes.func.isRequired,
  disallowToClassRoom: PropTypes.func.isRequired,
  setAllowedStudent: PropTypes.func.isRequired,
  setWaitingScreen: PropTypes.func.isRequired,
  activeTool: PropTypes.string.isRequired,
  isStudentAllowedToDraw: PropTypes.bool.isRequired,
  resetStudentCanvas: PropTypes.bool.isRequired,
}
