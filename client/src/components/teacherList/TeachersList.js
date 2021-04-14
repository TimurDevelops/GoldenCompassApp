import React from "react";
import PropTypes from "prop-types";
import './TeachersList.scss'
import TeacherItem from "./TeacherItem";

const TeachersList = ({teachers}) => {
  return (
    <div>
      Список учителей
      {teachers.map(teacher => <TeacherItem teacher={teacher}/>)}
    </div>
  )
}

TeachersList.propTypes = {
  teachers: PropTypes.array
}

export default TeachersList;