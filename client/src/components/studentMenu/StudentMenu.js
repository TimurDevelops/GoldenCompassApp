import React from "react";
import PropTypes from "prop-types";
import MenuItem from "../ui/MenuItem";

import './StudentMenu.scss'

const StudentMenu = ({logout}) => {

  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
        <MenuItem link={'/teachers-list'} label={'Начать урок'}/>
        <button className={'menu-button underline'} onClick={logout} >Выйти</button>
      </div>
    </div>
  )
}

StudentMenu.propTypes = {
  student: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default StudentMenu;