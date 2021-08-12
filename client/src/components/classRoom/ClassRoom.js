import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {useHistory, useParams} from "react-router-dom";

import Header from "../ui/Header";

import WaitingScreen from "./waitingScreen/WaitingScreen";

import VideoArea from "./videoArea/VideoArea";
import CanvasArea from "./canvasArea/CanvasArea";

import StudentPicker from "./studentPicker/StudentPicker";

import LevelPicker from "./levelPicker/LevelPicker";
import LessonPicker from "./lessonPicker/LessonPicker";
import SlidePicker from "./slidePicker/SlidePicker";

import api from "../../utils/api";

import "./ClassRoom.scss";

const ClassRoom = ({user, logout, setAlert}) => {
  const history = useHistory();
  const {teacher} = useParams();

  const [waitingScreen, setWaitingScreenState] = useState(true);

  const setWaitingScreen = (value) => {
    setWaitingScreenState(value)
  }

  const [slide, setSlide] = useState({});
  const [lesson, setLesson] = useState({});
  const [level, setLevel] = useState({});

  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);

  const [allowedStudent, setAllowedStudent] = useState();

  const [slidePickerOpen, setSlidePickerOpen] = useState(false);
  const [lessonPickerOpen, setLessonPickerOpen] = useState(false);
  const [levelPickerOpen, setLevelPickerOpen] = useState(false);

  const [studentPickerOpen, setStudentPickerOpen] = useState(false);


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
    const getLevels = async () => {
      if (user.type === 'teacher') {
        const res = await api.post('/level/get-levels', {login: user.login});
        setLevels(res.data.levels);
      }
    }
    getLevels().catch((err) => console.error(err))

  }, [user]);


  const disallowToClassRoom = () => {
    history.goBack();
  }

  const setSlideImg = (img) => {
    setSlide({tip: '', img})
  }

  const levelPicked = (newLevel) => {
    setLevel(newLevel);
    setLevelPickerOpen(false);
    setLessonPickerOpen(true);
  }

  const lessonPicked = (newLesson) => {
    setLesson(newLesson);
    setLessonPickerOpen(false);
    setSlidePickerOpen(true);
  }

  const slidePicked = (newSlide) => {
    setSlide(newSlide);
    setSlidePickerOpen(false);
  }

  return (
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
            slide={slide}
            setSlideImg={setSlideImg}
            allowedStudent={allowedStudent}
            setAllowedStudent={setAllowedStudent}
            disallowToClassRoom={disallowToClassRoom}
            setWaitingScreen={setWaitingScreen}
            setAlert={setAlert}
          />

          {/*{user.type === 'teacher' ? <SlidePicker setSlide={setSlide} slides={lesson.slides}/> : ''}*/}


          {user.type === 'teacher' ?
            <div className={'pickers'}>

              <SlidePicker open={slidePickerOpen}
                           setOpen={setSlidePickerOpen}
                           slides={lesson.slides}
                           setSlide={slidePicked}/>

              <LessonPicker open={lessonPickerOpen}
                            setOpen={setLessonPickerOpen}
                            lessons={level.lessons}
                            setLesson={lessonPicked}/>

              <LevelPicker open={levelPickerOpen}
                           setOpen={setLevelPickerOpen}
                           levels={levels}
                           setLevel={levelPicked}/>


              <StudentPicker open={studentPickerOpen}
                             setOpen={setStudentPickerOpen}
                             students={students}
                             setAllowedStudent={setAllowedStudent}
                             allowedStudent={allowedStudent}/>

              <div className={'menus-buttons'}>

                {!studentPickerOpen && <div className={'button-holder levels'}>
                  <div className={'button'} onClick={() => setLevelPickerOpen(!levelPickerOpen)}>Уровни</div>
                </div>}

                {!lessonPickerOpen && <div className={'button-holder students'}>
                  <div className={'button'} onClick={() => setStudentPickerOpen(!studentPickerOpen)}>Ученики</div>
                </div>}

              </div>
            </div>

            : ''}

        </section>

      </div>
    </div>
  )
}

ClassRoom.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
};

export default ClassRoom;