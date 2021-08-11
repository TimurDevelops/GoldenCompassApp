import React from "react";
import PropTypes from "prop-types";

const LessonItem = ({setLesson, lesson}) => {
  return (
    <div className={'item-wrapper'} onClick={setLesson}>
      <div className={'item'}>{lesson.name}</div>
    </div>
  )
}

LessonItem.propTypes = {
  setLesson: PropTypes.func.isRequired,
  lesson: PropTypes.object.isRequired,
}

export default LessonItem;