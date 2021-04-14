import React from "react";
import './TeacherMenuItem.scss'
import PropTypes from "prop-types";
import TeacherItem from "../teacherList/TeacherItem";

const TeacherMenuItem = ({label}) => {

  return (
    <div>
      {label}
    </div>
  );
}

TeacherItem.propTypes = {
  // TODO types
  label: PropTypes.object.isRequired
}

export default TeacherMenuItem;