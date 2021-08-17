import React from "react";
import MenuItem from "../ui/MenuItem";
import PropTypes from "prop-types";
import {useUser} from "../../hooks/useUser";

import GoBack from "../ui/GoBack";

const TeacherMenu = ({logout}) => {
  const {user} = useUser()

  return (
    <div className={"menu-bg"}>
      <div className={"menu-wrapper"}>
        <MenuItem link={`/canvas/${user.login}`} label={'Начать урок'}/>
        <MenuItem link={`/reset-password/${user.login}/${user.type}`} label={'Сменить пароль'}/>
        <button className={'menu-button underline'} onClick={logout} >Выйти</button>
      </div>
      <GoBack/>
    </div>
  );
}

TeacherMenu.propTypes = {
  logout: PropTypes.func.isRequired
}

export default TeacherMenu;