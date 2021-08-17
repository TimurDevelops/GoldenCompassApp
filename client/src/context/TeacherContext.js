import React, { createContext, useState, useEffect } from 'react';
import {useSocket} from "../hooks/useSocket";
import {useAlerts} from "../hooks/useAlerts";

const TeacherContext = createContext('');

const TeacherContextProvider = ({ children }) => {
  const {socket} = useSocket()
  const {setAlert} = useAlerts()

  const [waitingScreen, setWaitingScreen] = useState(false);
  const [waitingScreenMessage, setWaitingScreenMessage] = useState('');
  const [allowedStudent, setAllowedStudent] = useState();
  const [slide, setSlide] = useState();

  useEffect(() => {

    socket.on('student-requests-entrance', ({name}) => {
        setAlert(`Ученик ${name} отправил запрос на вход в класную комнату`, 'primary')
    })

    socket.on('allowed-student-set', ({login}) => {
      setAllowedStudent(login)
    })

    socket.on('canvas-slide-picked', ({slide}) => {
      setSlide(slide);
    })

    // TODO emit join-teacher at appropriate moment
    //       setWaitingScreen(true);
    //       setWaitingScreenMessage(`Учитель ${name} отсутствует на рабочем месте`)
    //

    socket.on('teacher-joined', () => {
      setWaitingScreen(false);
      setWaitingScreenMessage('')
    })

  }, [setAlert, socket]);

  return (
    <TeacherContext.Provider value={{
      waitingScreen,
      waitingScreenMessage,
      slide,
      allowedStudent,
    }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export { TeacherContextProvider, TeacherContext };
