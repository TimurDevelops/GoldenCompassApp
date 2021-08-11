import React from "react";
import PropTypes from "prop-types";

import MenuItem from "../ui/MenuItem";
import GoBack from "../ui/GoBack";

import './StudentMenu.scss'

const StudentMenu = ({user, logout}) => {

  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
        <MenuItem link={'/teachers-list'} label={'Начать урок'}/>
        <MenuItem link={`/reset-password/${user.login}/${user.type}`} label={'Сменить пароль'}/>
        <button className={'menu-button underline'} onClick={logout} >Выйти</button>
      </div>
      <GoBack/>
    </div>
  )
}

StudentMenu.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default StudentMenu;