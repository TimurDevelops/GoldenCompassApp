import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import {useParams} from "react-router-dom";

import Header from "../ui/Header";
import VideoArea from "./VideoArea/VideoArea";
import CanvasArea from "./CanvasArea/CanvasArea";
import SlidePicker from "./Slides/SlidePicker";
import LessonPicker from "./LessonPicker/LessonPicker";

import "./ClassRoom.scss";

const ClassRoom = ({user, logout, setAlert}) => {
  const [slide, setSlide] = useState({img: 'Добро пожаловать', id: 1, tip: ", Учитель;)"});
  const [lesson, setLesson] = useState({slides: []});

  const [students, setStudents] = useState([]);
  const {teacher} = useParams();

  useEffect(() => {
    const getStudents = async () => {
      if (user.type === 'teacher') {
        const res = await axios.post('http://localhost:5000/api/teacher/get-students', {teacherLogin: user.login});
        setStudents(res.data.students);
      }
    }
    getStudents().catch((err) => console.error(err))

  }, [user]);

  return (
    <Fragment>
      <div className={"class-room"}>

        {students.map(student => <div key={student._id}>{student.name}</div>)}

        <Header logout={logout}/>

        <section className={"class-room-wrapper"}>
          <VideoArea/>
          <CanvasArea
            userLogin={user.login}
            userType={user.type}
            teacherLogin={teacher}
            tip={slide.tip}
            slideImg={slide.img}
            setAlert={setAlert}
          />
          <SlidePicker setSlide={setSlide} slides={lesson.slides}/>
          <LessonPicker setLesson={setLesson}/>
        </section>
      </div>
    </Fragment>
  )
}

ClassRoom.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
};

export default ClassRoom;