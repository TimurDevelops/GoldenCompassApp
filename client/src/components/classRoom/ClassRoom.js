import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";

import Header from "../ui/Header";
import VideoArea from "./VideoArea/VideoArea";
import CanvasArea from "./CanvasArea/CanvasArea";
import SlidePicker from "./SlidePicker/SlidePicker";
import LessonPicker from "./LessonPicker/LessonPicker";
import StudentPicker from "./StudentPicker/StudentPicker";
import WaitingScreen from "./WaitingScreen/WaitingScreen";

import "./ClassRoom.scss";

const ClassRoom = ({user, logout, setAlert}) => {
  const history = useHistory();
  const [slide, setSlide] = useState({img: 'Добро пожаловать', id: 1, tip: ", Учитель;)"});
  const [lesson, setLesson] = useState({slides: []});

  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const {teacher} = useParams();

  const [allowedStudent, setAllowedStudent] = useState();

  let [studentPickerOpen, setStudentPickerOpen] = useState(false);
  let [lessonPickerOpen, setLessonPickerOpen] = useState(false);

  let [waitingScreen, setWaitingScreen] = useState(false);
  let disallowToClassRoom = () => {
    history.push("/" + user.type);
  }


  useEffect(() => {
    const getStudents = async () => {
      if (user.type === 'teacher') {
        const res = await axios.post('http://localhost:5000/api/teacher/get-students', {teacherLogin: user.login});
        setStudents(res.data.students);
      }
    }
    getStudents().catch((err) => console.error(err))

  }, [user]);

  useEffect(() => {
    const getLessons = async () => {
      if (user.type === 'teacher') {
        const res = await axios.post('http://localhost:5000/api/teacher/get-lessons', {teacherLogin: user.login});
        setLessons(res.data.lessons);
      }
    }
    getLessons().catch((err) => console.error(err))

  }, [user]);

  return (
    <Fragment>
      <div className={"class-room"}>

        <Header logout={logout}/>
        {waitingScreen ? <WaitingScreen/> :
        <section className={"class-room-wrapper"}>
          <VideoArea/>
          <CanvasArea
            userLogin={user.login}
            userType={user.type}
            teacherLogin={teacher}
            tip={slide.tip}
            slideImg={slide.img}
            setAlert={setAlert}
            allowedStudent={allowedStudent}
            disallowToClassRoom={disallowToClassRoom}
            setWaitingScreen={setWaitingScreen}
          />
          {user.type === 'teacher' ? <SlidePicker setSlide={setSlide} slides={lesson.slides}/> : ''}
          {user.type === 'teacher' ?
            <div className={'menus-holder'}>
              <LessonPicker open={lessonPickerOpen}
                            buttonVisible={!studentPickerOpen}
                            setOpen={setLessonPickerOpen}
                            lessons={lessons}
                            setLesson={setLesson}/>
              <StudentPicker open={studentPickerOpen}
                             buttonVisible={!lessonPickerOpen}
                             setOpen={setStudentPickerOpen}
                             students={students}
                             setAllowedStudent={setAllowedStudent}
                             allowedStudent={allowedStudent}/>
            </div>
            : ''}

        </section>}
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