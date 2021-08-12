import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {useHistory, useParams} from "react-router-dom";
import io from 'socket.io-client';

import Header from "../ui/Header";

import WaitingScreen from "./waitingScreen/WaitingScreen";

import VideoArea from "./videoArea/VideoArea";
import CanvasArea from "./canvasArea/CanvasArea";

import StudentPicker from "./studentPicker/StudentPicker";

import LevelPicker from "./levelPicker/LevelPicker";
import LessonPicker from "./lessonPicker/LessonPicker";
import SlidePicker from "./slidePicker/SlidePicker";

import api from "../../utils/api";

import {serverUrl} from '../../config.json';

import "./ClassRoom.scss";

const socket = io(serverUrl, {transports: ['websocket'], upgrade: false});

const ClassRoom = ({user, logout, setAlert}) => {
  const history = useHistory();
  const {teacher} = useParams();


  const [waitingScreen, setWaitingScreen] = useState(true);

  const [slide, setSlide] = useState({});
  const [lesson, setLesson] = useState({});
  const [level, setLevel] = useState({});

  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);

  const [allowedStudent, setAllowedStudent] = useState();

  const studentPicked = (value) => {
    setAllowedStudent(value)
    socket.emit("allowStudent", {teacherLogin: teacher, studentLogin: value});
  }


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


  useEffect(() => {
    socket.emit('joinClassRoom', {login: user.login, teacher: teacher, usertype: user.type});

  }, [teacher, user.login, user.type]);

  socket.on('joinedClassRoom', ({user}) => {
    setWaitingScreen(false);
    if (user.user.type === 'teacher' && user.allowedStudents.length) {
      setAllowedStudent(user.allowedStudents[0])
    }
  })
  socket.on('studentRequestsEntrance', (data) => {
    if (user.type === 'teacher') {
      setAlert(`Ученик ${data.name} отправил запрос на вход в класную комнату`, 'primary')
    }
  })


  socket.on('studentAllowed', () => {
    socket.emit('joinClassRoom', {login: user.login, teacher, usertype: user.type});
  })
  socket.on('teacherNotPresent', (data) => {
    disallowToClassRoom()
    setAlert(`Учитель ${data.name} отсутствует на рабочем месте`, 'danger')
  })
  socket.on('studentDisallowed', (data) => {
    setWaitingScreen(true);
    setAlert(`Отправлен запрос на вход в классную комнату учителю ${data.name}`, 'light')
  })

  const disallowToClassRoom = () => {
    history.goBack();
  }

  // Для ученика когда учитель выбирает слайд
  socket.on('slideChanged', ({slide}) => {
    setSlide(slide);
  })

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
    socket.emit("changeSlide", {teacherLogin: teacher, slide: newSlide});
  }

  return (
    <div className={"class-room"}>
      <Header logout={logout}/>
      <div className={'waiting-screen-class-room-wrapper'}>

        {waitingScreen ? <WaitingScreen/> : ''}


        <section className={"class-room-wrapper"}>
          <VideoArea/>

          <CanvasArea
            socket={socket}
            room={teacher}

            slide={slide}

            canvasActive={!slidePickerOpen && !lessonPickerOpen && !levelPickerOpen && !studentPickerOpen}
            userType={user.type}
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
  setAlert: PropTypes.func.isRequired
};

export default ClassRoom;