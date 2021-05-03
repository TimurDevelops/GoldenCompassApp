import React from "react";
import './TeacherMenu.scss'
import MenuItem from "../layout/MenuItem";
import PropTypes from "prop-types";

const TeacherMenu = ({user, logout}) => {
  console.log('unsetUser')

  return (
    <div>
      <MenuItem label="" link={`/canvas/${user.login}`}/>
      <button className={'menu-button'} onClick={logout} >Выйти</button>
    </div>
  );
}

TeacherMenu.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default TeacherMenu;