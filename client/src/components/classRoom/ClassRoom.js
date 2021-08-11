import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import api from "../../utils/api";
import {useHistory, useParams} from "react-router-dom";

import Header from "../ui/Header";
import VideoArea from "./videoArea/VideoArea";
import CanvasArea from "./canvasArea/CanvasArea";
import SlidePicker from "./slidePicker/SlidePicker";
import LessonPicker from "./lessonPicker/LessonPicker";
import StudentPicker from "./studentPicker/StudentPicker";
import WaitingScreen from "./waitingScreen/WaitingScreen";

import "./ClassRoom.scss";

const ClassRoom = ({user, logout, setAlert}) => {
  const history = useHistory();
  const [slide, setSlide] = useState({img: 'Добро пожаловать', id: 1, tip: ", Учитель;)"});
  const [lesson, setLesson] = useState({slides: []});

  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const {teacher} = useParams();

  const [allowedStudent, setAllowedStudent] = useState();

  let [lessonPickerOpen, setLessonPickerOpen] = useState(false);
  let [studentPickerOpen, setStudentPickerOpen] = useState(false);

  let [waitingScreen, setWaitingScreen] = useState(false);
  let disallowToClassRoom = () => {
    history.goBack();
  }


  useEffect(() => {
    const getStudents = async () => {
      if (user.type === 'teacher') {
        const res = await api.post('/teacher/get-students', {teacherLogin: user.login});
        setStudents(res.data.students);
      }
    }
    getStudents().catch((err) => console.error(err))

  }, [user]);

  useEffect(() => {
    const getLessons = async () => {
      if (user.type === 'teacher') {
        const res = await api.post('/teacher/get-levels', {teacherLogin: user.login});
        setLessons(res.data.lessons);
      }
    }
    getLessons().catch((err) => console.error(err))

  }, [user]);

  return (
    <Fragment>
      <div className={"class-room"}>
        <Header logout={logout}/>
        <div className={'waiting-screen-class-room-wrapper'}>

          {waitingScreen ? <WaitingScreen/> : ''}


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
            {/*{user.type === 'teacher' ? <SlidePicker setSlide={setSlide} slides={lesson.slides}/> : ''}*/}
            {user.type === 'teacher' ?
              <div className={'pickers'}>

                <LessonPicker open={lessonPickerOpen}
                              setOpen={setLessonPickerOpen}
                              lessons={lessons}
                              setLesson={setLesson}/>

                {/*<StudentPicker open={studentPickerOpen}*/}
                {/*               setOpen={setStudentPickerOpen}*/}
                {/*               students={students}*/}
                {/*               setAllowedStudent={setAllowedStudent}*/}
                {/*               allowedStudent={allowedStudent}/>*/}

                <div className={'menus-buttons'}>

                  {!studentPickerOpen && <div className={`button-holder`} >
                    <div className={'button'} onClick={() => setLessonPickerOpen(!lessonPickerOpen)}>Уровни</div>
                  </div>}

                  {!lessonPickerOpen && <div className={`button-holder`}>
                    <div className={'button'} onClick={() => setStudentPickerOpen(!studentPickerOpen)}>Ученики</div>
                  </div>}

                </div>
              </div>

              : ''}

          </section>

        </div>
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