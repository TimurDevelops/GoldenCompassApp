import React, {createContext, useState, useRef, useEffect} from 'react';
import Peer from 'simple-peer';
import {useSocket} from "../hooks/useSocket";
import {useUser} from "../hooks/useUser";

const VideoContext = createContext('');

const VideoContextProvider = ({children}) => {
  const {user} = useUser();
  const {socket} = useSocket();

  const [stream, setStream] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef({});

  useEffect(() => {

    socket.on('student-calling', ({studentLogin}) => {
      answerCall(studentLogin);
    });

  }, [socket]);

  const answerCall = (studentLogin) => {
    socket.emit('call-accepted', {studentLogin});

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((currentStream) => {
        if (myVideo.current) myVideo.current.srcObject = currentStream;

        const teacherPeer = new Peer({initiator: false, stream: currentStream})

        teacherPeer.on('signal', data => {
          socket.emit('teacher-send-signal', {studentLogin, stream: data});
        })

        teacherPeer.on('stream', stream => {
          if (userVideo.current) userVideo.current.srcObject = stream;
        })

        socket.on('student-accepted-signal', ({stream}) => {
          teacherPeer.signal(stream)
        });

      });
  };

  const callTeacher = (teacherLogin) => {
    socket.emit('call-teacher', {teacherLogin, studentLogin: user.login});

    socket.on('teacher-accepted-call', () => {
      connect();
    });

    const connect = () => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((currentStream) => {
          if (myVideo.current) myVideo.current.srcObject = currentStream;

          const studentPeer = new Peer({initiator: true, stream: currentStream})

          studentPeer.on('signal', data => {
            socket.emit('student-send-signal', {teacherLogin, stream: data});
          })

          studentPeer.on('stream', stream => {
            if (userVideo.current) userVideo.current.srcObject = stream;
          })

          socket.on('teacher-accepted-signal', ({stream}) => {
            studentPeer.signal(stream)
          });

        });
    }
  };

  return (
    <VideoContext.Provider value={{
      myVideo,
      userVideo,
      stream,
      callUser: callTeacher,
      answerCall,
    }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export {VideoContextProvider, VideoContext};
