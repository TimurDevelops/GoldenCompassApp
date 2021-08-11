import React, {Fragment, useEffect, useState} from 'react';
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

  const [waitingScreen, setWaitingScreen] = useState(false);

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
        const res = await api.post('/levels/get-levels', {teacherLogin: user.login});
        setLevels(res.data.levels);
      }
    }
    getLevels().catch((err) => console.error(err))

  }, [user]);


  let disallowToClassRoom = () => {
    history.goBack();
  }

  const levelPicked = (newLevel) => {
    setLevel(newLevel)
    setLessonPickerOpen(true)
  }

  const lessonPicked = (newLesson) => {
    setLesson(newLesson)
    setLevelPickerOpen(true)
  }


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
              slide={slide}
              allowedStudent={allowedStudent}
              disallowToClassRoom={disallowToClassRoom}
              setWaitingScreen={setWaitingScreen}
              setAlert={setAlert}
            />

            {/*{user.type === 'teacher' ? <SlidePicker setSlide={setSlide} slides={lesson.slides}/> : ''}*/}


            {user.type === 'teacher' ?
              <div className={'pickers'}>

                {lesson.slides && <SlidePicker open={slidePickerOpen}
                             setOpen={setSlidePickerOpen}
                             slides={lesson.slides}
                             setSlide={setSlide}/>}

                {level.lessons && <LessonPicker open={lessonPickerOpen}
                             setOpen={setLessonPickerOpen}
                             lessons={level.lessons}
                             setLessons={lessonPicked}/>}

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

                  {!studentPickerOpen && <div className={`button-holder`} >
                    <div className={'button'} onClick={() => setLevelPickerOpen(!levelPickerOpen)}>Уровни</div>
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