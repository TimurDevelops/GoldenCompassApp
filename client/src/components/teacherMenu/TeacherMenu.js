import React from "react";
import './TeacherMenu.scss'
import MenuItem from "../layout/MenuItem";
import useUser from "../../utils/useUser";

const TeacherMenu = () => {
  const {user, unsetUser} = useUser()

  return (
    <div>
      <MenuItem label="" link={`/canvas/${user.login}`}/>
      <button className={'menu-button'} onClick={unsetUser} >Выйти</button>
    </div>
  );
}

export default TeacherMenu;