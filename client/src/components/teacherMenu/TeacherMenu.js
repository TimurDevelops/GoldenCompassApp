import React from "react";
import MenuItem from "../ui/MenuItem";
import PropTypes from "prop-types";

import "./TeacherMenu.scss"

const TeacherMenu = ({user, logout}) => {
  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
        <MenuItem link={`/canvas/${user.login}`} label={'Начать урок'}/>
        <button className={'menu-button underline'} onClick={logout} >Выйти</button>
      </div>
    </div>
  );
}

TeacherMenu.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default TeacherMenu;