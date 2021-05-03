import React from "react";
import PropTypes from "prop-types";
import './StudentMenu.scss'
import MenuItem from "../layout/MenuItem";

const StudentMenu = ({logout}) => {

  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
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