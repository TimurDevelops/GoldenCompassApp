import React from "react";
import PropTypes from "prop-types";
import './TeacherItem.scss'

const TeacherItem = ({name}) => {

  return (
    <div>
      {name}
    </div>
  );
}

TeacherItem.propTypes = {
  // TODO types
  teacher: PropTypes.object.isRequired
}

export default TeacherItem;