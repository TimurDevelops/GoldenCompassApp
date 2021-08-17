import React, { createContext, useState, useEffect } from 'react';
import {useSocket} from "../hooks/useSocket";
import { useAlert } from 'react-alert'


const TeacherContext = createContext('');

const TeacherContextProvider = ({ children }) => {
  const alert = useAlert()
  const {socket} = useSocket()

  const [waitingScreen, setWaitingScreen] = useState(false);
  const [waitingScreenMessage, setWaitingScreenMessage] = useState('');
  const [allowedStudent, setAllowedStudent] = useState();
  const [slide, setSlide] = useState({});

  useEffect(() => {

    socket.on('student-requests-entrance', ({name}) => {
      alert.show(`Ученик ${name} отправил запрос на вход в класную комнату`, 'primary')
    })

    socket.on('allowed-student-set', ({login}) => {
      setAllowedStudent(login)
    })

    socket.on('canvas-slide-picked', ({slide}) => {
      setSlide(slide);
    })



    socket.on('teacher-joined', () => {
      setWaitingScreen(false);
      setWaitingScreenMessage('')
    })

  }, [alert, socket]);

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
