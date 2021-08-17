import React from "react";
import MenuItem from "../ui/MenuItem";
import PropTypes from "prop-types";

const TeacherItem = ({teacher}) => {
  return (
    <div>
      <MenuItem link={`/canvas/${teacher.login}`} label={teacher.name}/>
    </div>
  )
}

TeacherItem.propTypes = {
  teacher: PropTypes.object.isRequired,
}

export default TeacherItem;