import React, {Fragment, useState} from 'react';
import Header from "../layout/Header";
import useUser from "../../utils/useUser";
import VideoArea from "./VideoArea";
import WorkingSpace from "./WorkingSpace";
import SlidePicker from "./SlidePicker";
import LessonPicker from "./LessonPicker";

const ClassRoom = () => {
  const {user, unsetUser} = useUser()
  const [slide, setSlide] = useState({})
  const [lesson, setLesson] = useState({})

  const logout = () => {
    unsetUser();
  }

  return (
    <Fragment>
      <Header logout={logout}/>

      <section>
        <VideoArea/>
        <WorkingSpace userType={user.type} tip={slide.tip} slideImg={slide.slideImg}/>
        <SlidePicker setSlide={setSlide} slides={lesson.slides}/>
        <LessonPicker setLesson={setLesson}/>
      </section>

    </Fragment>
  )
}


export default ClassRoom;