import React from "react";
import './TeacherItem.scss'

const TeacherItem = ({teacher}) => {
  console.log(teacher)
  return (
    <div>
      {teacher.name}
    </div>
  )
}


export default TeacherItem;