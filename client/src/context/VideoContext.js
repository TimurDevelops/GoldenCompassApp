import React, {createContext, useRef, useState} from 'react';
import Peer from 'simple-peer';
import {useUser} from "../hooks/useUser";
import io from 'socket.io-client'

import {serverUrl} from '../config.json';

const socket = io(serverUrl);

const VideoContext = createContext('');

const VideoContextProvider = ({children}) => {
  const {getUser} = useUser();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef({});

  const [stream, setStream] = useState();
  const [callerSignal, setCallerSignal] = useState();
  const [caller, setCaller] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [calling, setCalling] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);

  const [captureVideo, setCaptureVideo] = useState(true);
  const [captureAudio, setCaptureAudio] = useState(true);
  const [captureNone, setCaptureNone] = useState(false);

  const setup = (room) => {
    const user = getUser()

    socket.emit('add-to-video', {login: user.login});

    navigator.mediaDevices.getUserMedia({video: captureVideo, audio: captureAudio})
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    const startVideo = ({callStarted}) => {
      console.log(callStarted)
      if (callStarted) {
        if (user.type === 'student') {
          console.log('calling')
          callTeacher(room)
        } else {
          socket.on('student-calling', ({studentLogin, signal}) => {
            setCallerSignal(signal);
            answerCall(studentLogin);
          });
        }
      } else {
        socket.on('student-calling', ({studentLogin, signal}) => {
          console.log('student-calling')
          setReceivingCall(true);
          setCaller(studentLogin);
          setCallerSignal(signal);
        });
      }
    }

    socket.on('added', startVideo)

  }


  const setVideo = (value) => {
    if (value) {
      setCaptureNone(false)
      setCaptureVideo(true)
    } else {
      if (!captureAudio) {
        setCaptureNone(true);
      } else {
        setCaptureVideo(false)
      }
    }
  }

  const setAudio = (value) => {
    if (value) {
      setCaptureNone(false)
      setCaptureAudio(true)
    } else {
      if (!captureVideo) {
        setCaptureNone(true);
      } else {
        setCaptureAudio(false)
      }
    }
  }

  const answerCall = (studentLogin) => {
    console.log('answerCall')
    const user = getUser();
    const teacherPeer = new Peer({initiator: false, trickle: false, stream: stream});

    teacherPeer.on('signal', data => {
      console.log('call-accepted')
      setCallAccepted(true);
      setReceivingCall(false);
      socket.emit('call-accepted', {teacherLogin: user.login, studentLogin, signal: data});
    })

    teacherPeer.on("stream", stream => {
      if (userVideo.current) userVideo.current.srcObject = stream;
    });

    teacherPeer.signal(callerSignal)

    connectionRef.current = teacherPeer;
  };

  const callTeacher = (teacherLogin) => {
    const user = getUser();

    const studentPeer = new Peer({initiator: true, trickle: false, stream: stream})

    studentPeer.on('signal', data => {
      setCalling(false);
      socket.emit('call-teacher', {teacherLogin, studentLogin: user.login, signalData: data});
    })

    studentPeer.on("stream", stream => {
      if (userVideo.current) userVideo.current.srcObject = stream;
    });

    socket.on('teacher-accepted-call', ({signal}) => {
      console.log('teacher-accepted-call')
      setCallAccepted(true);
      studentPeer.signal(signal);
    });

    connectionRef.current = studentPeer;
  };

  const leaveCall = () => {
    setReceivingCall(false);
    setCallAccepted(false);
    setCalling(false);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <VideoContext.Provider value={{
      setup,
      caller,

      callAccepted,
      calling,
      receivingCall,

      myVideo,
      userVideo,

      callTeacher,
      answerCall,
      leaveCall,

      captureVideo,
      captureAudio,
      captureNone,
      setVideo,
      setAudio,
    }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export {VideoContextProvider, VideoContext};
