import React from "react";
import MenuItem from "../ui/MenuItem";

const TeacherItem = ({teacher}) => {
  return (
    <div>
      <MenuItem link={`/canvas/${teacher.login}`} label={teacher.name}/>
    </div>
  )
}

export default TeacherItem;