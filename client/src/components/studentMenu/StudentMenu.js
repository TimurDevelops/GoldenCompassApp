import React from "react";
import PropTypes from "prop-types";
import './StudentMenu.scss'
import MenuItem from "../ui/MenuItem";

const StudentMenu = ({logout}) => {

  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
        Меню ученика
        <MenuItem link={'/teachers-list'} label={'Начать урок'}/>
        <button className={'menu-button'} onClick={logout} >Выйти</button>
      </div>
    </div>
  )
}

StudentMenu.propTypes = {
  student: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default StudentMenu;