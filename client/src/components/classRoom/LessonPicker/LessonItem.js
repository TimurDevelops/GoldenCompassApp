import React from "react";
import PropTypes from "prop-types";

import './LessonItem.scss';

const LessonItem = ({setLesson, lesson}) => {
  return (
    <button onClick={() => setLesson(lesson)}>{lesson.name}</button>
  )
}

LessonItem.propTypes = {
  setLesson: PropTypes.func.isRequired,
  lesson: PropTypes.object.isRequired,
}

export default LessonItem;