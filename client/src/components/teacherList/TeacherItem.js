import React from "react";
import PropTypes from "prop-types";
import './TeacherItem.scss'

const TeacherItem = ({name}) => {
  return (
    <div>
      {name}
    </div>
  )
}

TeacherItem.propTypes = {
  teacher: PropTypes.object
}

export default TeacherItem;