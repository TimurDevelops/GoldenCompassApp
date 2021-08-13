import React, { createContext, useState, useEffect } from 'react';
import {useSocket} from "../hooks/useSocket";
import {useAlerts} from "../hooks/useAlerts";
import useUser from "../hooks/useUser";

const SocketContext = createContext('');

const ContextProvider = ({ children }) => {
  const socket = useSocket();
  const {setAlert} = useAlerts();
  const {user} = useUser();

  const [waitingScreen, setWaitingScreen] = useState(false);
  const [waitingScreenMessage, setWaitingScreenMessage] = useState('');
  const [slideImg, setSlideImg] = useState('');
  const [allowedToDraw, setAllowedToDraw] = useState('');

  useEffect(() => {

    // TODO check data structure
    // TODO notAllowedToClassRoom event
    socket.on('notAllowedToClassRoom', ({name}) => {
      setWaitingScreen(true);
      setWaitingScreenMessage(`Отправлен запрос на вход в классную комнату учителю ${name}`)
    })

    // TODO check data structure
    // TODO allowedToClassRoom event
    socket.on('allowedToClassRoom', ({teacher}) => {

      // TODO studentJoinClassRoom event
      // TODO teacherJoinClassRoom event
      socket.emit('studentJoinClassRoom', {user, teacher});
    })

    socket.on('teacherNotPresent', ({name}) => {
      setWaitingScreen(true);
      setWaitingScreenMessage(`Учитель ${name} отсутствует на рабочем месте`)
    })

    // TODO teacherPresent event
    socket.on('teacherPresent', () => {
      setWaitingScreen(true);
      setWaitingScreenMessage('')
    })

    // TODO studentJoinedClassRoom event
    socket.on('studentJoinedClassRoom', () => {
      setWaitingScreen(false);
      setWaitingScreenMessage('')
    })

    socket.on('slideChanged', ({img}) => {
      setSlideImg(img);
    })

    socket.on('allowToDraw', ({allowStudentToDraw}) => {
      if (allowStudentToDraw) setAlert("Вы можете рисовать")
      else setAlert("Учитель отключил вам возможность рисовать")

      setAllowedToDraw(allowStudentToDraw);
    })

  }, []);


  return (
    <SocketContext.Provider value={{
      waitingScreen,
      waitingScreenMessage,
      slideImg,
      allowedToDraw,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
