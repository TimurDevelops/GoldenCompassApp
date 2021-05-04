import React, {Fragment, useState} from 'react';
import Header from "../ui/Header";
import useUser from "../../utils/useUser";
import VideoArea from "./VideoArea/VideoArea";
import CanvasArea from "./CanvasArea/CanvasArea";
import SlidePicker from "./Slides/SlidePicker";
import LessonPicker from "./LessonPicker/LessonPicker";


const ClassRoom = () => {
  const {user, unsetUser} = useUser()
  const [slide, setSlide] = useState({img: 'Добро пожаловать', id: 1, tip: ", Учитель;)"})
  const [lesson, setLesson] = useState({slides: []})

  return (
    <Fragment>
      <Header logout={unsetUser}/>

      <section className={"class-room"}>
        <VideoArea/>
        <CanvasArea userType={user.type} tip={slide.tip} slideImg={slide.img}/>
        <SlidePicker setSlide={setSlide} slides={lesson.slides}/>
        <LessonPicker setLesson={setLesson}/>
      </section>

    </Fragment>
  )
}


export default ClassRoom;