import React from "react";
import PropTypes from "prop-types";

import './StudentItem.scss'

const SlideItem = ({setAllowedStudent, student}) => {

  return (
    <button onClick={() => setAllowedStudent(student)}>
      <div>{student.img}</div>
    </button>
  )
}

SlideItem.propTypes = {
  setAllowedStudent: PropTypes.func.isRequired,
  student: PropTypes.object.isRequired,
}

export default SlideItem;
