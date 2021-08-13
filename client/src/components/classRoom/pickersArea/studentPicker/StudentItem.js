import React from "react";
import PropTypes from "prop-types";

import './StudentItem.scss'

const SlideItem = ({setAllowedStudent, student, allowedStudent}) => {

  return (
    <div className={'item-wrapper'}>
      <div className={`item ${student.login === allowedStudent ? 'current' : ''}`}>

        <div className={'name'}>
          {student.name}
        </div>

        <div className={'button'} onClick={() => setAllowedStudent(student.login)}>Допустить</div>
      </div>
    </div>
  )
}

SlideItem.propTypes = {
  setAllowedStudent: PropTypes.func.isRequired,
  student: PropTypes.object.isRequired,
  allowedStudent: PropTypes.string
}

export default SlideItem;
