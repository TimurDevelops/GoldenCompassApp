import React, {createContext, useState, useEffect} from 'react';
import { useAlert } from 'react-alert'

import {useSocket} from "../hooks/useSocket";
import {useUser} from "../hooks/useUser";

const StudentContext = createContext('');

const StudentContextProvider = ({children}) => {
  const alert = useAlert()
  const {socket} = useSocket();
  const {getUser} = useUser();


  const [waitingScreen, setWaitingScreen] = useState(false);
  const [waitingScreenMessage, setWaitingScreenMessage] = useState('');
  const [slide, setSlide] = useState({});
  const [allowedToDraw, setAllowedToDraw] = useState(true);


  useEffect(() => {

    socket.on('student-disallowed', ({name}) => {

      setWaitingScreen(true);
      setWaitingScreenMessage(`Отправлен запрос на вход в классную комнату учителю ${name}`)
    })

    socket.on('student-allowed', ({teacher}) => {
      const user = getUser()
      socket.emit('join-student', {room: teacher, login: user.login});
    })

    socket.on('teacher-absent', ({name}) => {
      setWaitingScreen(true);
      setWaitingScreenMessage(`Учитель ${name} отсутствует на рабочем месте`)
    })

    socket.on('teacher-present', ({login: teacherLogin}) => {
      const user = getUser()
      setWaitingScreen(false);
      setWaitingScreenMessage('')
      socket.emit('join-student', {room: teacherLogin, login: user.login});
    })

    socket.on('student-joined', () => {
      setWaitingScreen(false);
      setWaitingScreenMessage('')
    })

    socket.on('canvas-slide-changed', ({slide}) => {
      setSlide(slide);
    })

    socket.on('drawing-enabled-set', ({isEnabled: allowStudentToDraw}) => {
      if (allowStudentToDraw) alert.show("Вы можете рисовать")
      else alert.show("Учитель отключил вам возможность рисовать")

      setAllowedToDraw(allowStudentToDraw);
    })

    socket.on('canvas-reset', () => {
      alert.show("Учитель перезапустил ваш холст")
    })

  }, []);


  return (
    <StudentContext.Provider value={{
      waitingScreen,
      waitingScreenMessage,
      slide,
      allowedToDraw,
    }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export {StudentContextProvider, StudentContext};
