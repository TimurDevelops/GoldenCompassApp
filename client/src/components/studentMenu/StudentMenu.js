import React from "react";
import PropTypes from "prop-types";
import './StudentMenu.scss'
import MenuItem from "../layout/MenuItem";
import useUser from "../../utils/useUser";

const StudentMenu = () => {
  const {unsetUser} = useUser()

  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
        <MenuItem link={'/teachers-list'} label={'Начать урок'}/>

        <button className={'menu-button'} onClick={unsetUser} >Выйти</button>
      </div>
    </div>
  )
}

StudentMenu.propTypes = {
  student: PropTypes.object.isRequired
}

export default StudentMenu;