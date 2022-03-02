import React, {useContext, useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {useParams} from "react-router-dom";

import Header from "../ui/Header";

import WaitingScreen from "../ui/WaitingScreen";

import VideoArea from "./videoArea/VideoArea";
import CanvasArea from "./canvasArea/CanvasArea";

import StudentPicker from "./pickersArea/studentPicker/StudentPicker";

import LevelPicker from "./pickersArea/levelPicker/LevelPicker";
import LessonPicker from "./pickersArea/lessonPicker/LessonPicker";
import SlidePicker from "./pickersArea/slidePicker/SlidePicker";

import api from "../../utils/api";

import {useSocket} from "../../hooks/useSocket";
import {useUser} from "../../hooks/useUser";

import "./ClassRoom.scss";
import {TeacherContext} from "../../context/TeacherContext";
import {StudentContext} from "../../context/StudentContext";

const ClassRoom = ({logout}) => {
  const {teacher} = useParams();
  const {socket} = useSocket();
  const {user} = useUser();

  const {allowedStudent} = useContext(TeacherContext)
  const {waitingScreen, waitingScreenMessage} = useContext(StudentContext)

  const [lesson, setLesson] = useState({});
  const [level, setLevel] = useState({});

  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [slides, setSlides] = useState([]);

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
    const getLessons = async () => {
      if (user.type === 'teacher') {
        const res = await api.post('/level/get-levels', {login: user.login});
        setLevels(res.data.levels);
      }
    }
    getLessons().catch((err) => console.error(err))

  }, [user]);

  useEffect(() => {
    const getLevels = async () => {
      if (user.type === 'teacher' && level._id) {
        const res = await api.post('/level/get-lessons', {level: level._id});
        setLessons(res.data.lessons);
      }
    }
    getLevels().catch((err) => console.error(err))

  }, [level]);

  useEffect(() => {
    const getSlides = async () => {
      if (user.type === 'teacher' && lesson._id) {
        const res = await api.post('/level/get-slides', {lesson: lesson._id});
        setSlides(res.data.slides);
      }
    }
    getSlides().catch((err) => console.error(err))

  }, [lesson]);

  useEffect(() => {
    if (user.type === 'teacher') socket.emit("join-teacher", {room: teacher, login: user.login});
    else if (user.type === 'student') socket.emit("join-student", {room: teacher, login: user.login});
  }, [user, socket, teacher]);

  const studentPicked = (value) => {
    socket.emit("student-allow", {teacherLogin: teacher, studentLogin: value});
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

  const slidePicked = (value) => {
    socket.emit("canvas-change-slide", {teacherLogin: teacher, slide: value});
  }


  return (
    <div className={"class-room"}>
      <WaitingScreen message={waitingScreenMessage} active={waitingScreen}/>
      <Header logout={logout}/>
      <div className={'waiting-screen-class-room-wrapper'}>

        <section className={"class-room-wrapper"}>
          <VideoArea room={teacher}/>

          <CanvasArea
            room={teacher}
            sidebarOpen={!lessonPickerOpen && !levelPickerOpen && !studentPickerOpen}
          />

          {user.type === 'teacher' ?
            <SlidePicker open={slidePickerOpen}
                       setOpen={setSlidePickerOpen}
                       slides={slides}
                       setSlide={slidePicked}/> : ''}


          {user.type === 'teacher' ?
            <div className={'pickers'}>


              <LessonPicker open={lessonPickerOpen}
                            setOpen={setLessonPickerOpen}
                            lessons={lessons}
                            setLesson={lessonPicked}/>

              <LevelPicker open={levelPickerOpen}
                           setOpen={setLevelPickerOpen}
                           levels={levels}
                           setLevel={levelPicked}/>


              <StudentPicker open={studentPickerOpen}
                             setOpen={setStudentPickerOpen}
                             students={students}
                             setAllowedStudent={studentPicked}
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
};

export default ClassRoom;