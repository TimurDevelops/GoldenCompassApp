import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {useHistory, useParams} from "react-router-dom";

import Header from "../ui/Header";

import WaitingScreen from "../ui/WaitingScreen";

import VideoArea from "./videoArea/VideoArea";
import CanvasArea from "./canvasArea/CanvasArea";

import StudentPicker from "./pickersArea/studentPicker/StudentPicker";

import LevelPicker from "./pickersArea/levelPicker/LevelPicker";
import LessonPicker from "./pickersArea/lessonPicker/LessonPicker";
import SlidePicker from "./pickersArea/slidePicker/SlidePicker";

import api from "../../utils/api";

//  TODO привести к одному виду
import {useAlerts} from "../../hooks/useAlerts";
import {useSocket} from "../../hooks/useSocket";
import useUser from "../../hooks/useUser";

import "./ClassRoom.scss";

const ClassRoom = ({logout}) => {
  const history = useHistory();
  const {teacher} = useParams();
  const {setAlert} = useAlerts()
  const {socket} = useSocket();
  const {user} = useUser();

  const [waitingScreen, setWaitingScreenState] = useState(true);

  const setWaitingScreen = (value) => {
    setWaitingScreenState(value)
  }

  // TODO получать slide из context
  const [lesson, setLesson] = useState({});
  const [level, setLevel] = useState({});

  const [students, setStudents] = useState([]);
  const [levels, setLevels] = useState([]);

  // TODO получать allowedStudent из context

  const [slidePickerOpen, setSlidePickerOpen] = useState(false);
  const [lessonPickerOpen, setLessonPickerOpen] = useState(false);
  const [levelPickerOpen, setLevelPickerOpen] = useState(false);

  const [studentPickerOpen, setStudentPickerOpen] = useState(false);


  const studentPicked = (value) => {
    socket.emit("allowStudent", {teacherLogin: teacher, studentLogin: value});
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
    const getLevels = async () => {
      if (user.type === 'teacher') {
        const res = await api.post('/level/get-levels', {login: user.login});
        setLevels(res.data.levels);
      }
    }
    getLevels().catch((err) => console.error(err))

  }, [user]);


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
    // TODO name better
    socket.emit("slidePicked", {teacherLogin: teacher, studentLogin: value});
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
            room={teacher}
            sidebarOpen={!slidePickerOpen && !lessonPickerOpen && !levelPickerOpen && !studentPickerOpen}
          />

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
};

export default ClassRoom;