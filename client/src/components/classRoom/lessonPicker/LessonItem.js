import React from "react";
import PropTypes from "prop-types";

const LessonItem = ({setLevel, level}) => {
  return (
    <button onClick={setLevel}>{level.name}</button>
  )
}

LessonItem.propTypes = {
  setLevel: PropTypes.func.isRequired,
  level: PropTypes.object.isRequired,
}

export default LessonItem;