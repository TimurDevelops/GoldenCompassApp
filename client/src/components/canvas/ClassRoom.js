import React, {Fragment} from 'react';
import Header from "../layout/Header";
import useUser from "../../utils/useUser";
import VideoArea from "./VideoArea";
import WorkingSpace from "./WorkingSpace";
import LessonPicker from "./LessonPicker";

const ClassRoom = () => {
  const {user, unsetUser} = useUser()

  const logout = () => {
    unsetUser();
  }

  return (
    <Fragment>
      <Header logout={logout}/>

      <section>
        <VideoArea/>
        <WorkingSpace userType={user.type}/>
        <LessonPicker/>
      </section>

    </Fragment>
  )
}


export default ClassRoom;