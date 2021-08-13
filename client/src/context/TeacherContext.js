import React, { createContext, useState, useEffect } from 'react';
import {useSocket} from "../hooks/useSocket";
import {useAlerts} from "../hooks/useAlerts";

const SocketContext = createContext('');

const ContextProvider = ({ children }) => {
  const {socket} = useSocket()
  const {setAlert} = useAlerts()

  const [allowedStudent, setAllowedStudent] = useState();
  const [slide, setSlide] = useState();

  useEffect(() => {

    socket.on('studentRequestsEntrance', (data) => {
        setAlert(`Ученик ${data.name} отправил запрос на вход в класную комнату`, 'primary')
    })

    socket.on('studentAllowed', ({login}) => {
      setAllowedStudent(login)
    })

    socket.on('slidePicked', ({img}) => {
      setSlide(img);
    })
  }, []);

  return (
    <SocketContext.Provider value={{
      slide,
      allowedStudent
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
