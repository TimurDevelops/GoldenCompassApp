import React from "react";
import './TeacherMenu.scss'
import MenuItem from "../ui/MenuItem";
import PropTypes from "prop-types";

const TeacherMenu = ({user, logout}) => {
  return (
    <div>
      Меню учителя
      <MenuItem link={`/canvas/${user.login}`} label={'Начать урок'}/>

      <button className={'menu-button'} onClick={logout} >Выйти</button>
    </div>
  );
}

TeacherMenu.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default TeacherMenu;