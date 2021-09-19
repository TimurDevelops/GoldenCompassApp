import React, {createContext, useEffect, useRef, useState} from 'react';
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

  const [stream, setStream] = useState({});
  const [callerSignal, setCallerSignal] = useState();
  const [caller, setCaller] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [calling, setCalling] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);


  const [captureVideo, setCaptureVideo] = useState(true);
  const [captureAudio, setCaptureAudio] = useState(true);


  // Обработка отключения/включения видео/аудио
  useEffect(() => {
    if (callAccepted) {
      const user = getUser()

      stream.getVideoTracks().forEach(track => track.enabled = captureVideo);
      stream.getAudioTracks().forEach(track => track.enabled = captureAudio);

      if (user.type === 'student') {
        connectionRef.current = new Peer({initiator: false, trickle: false, stream: stream})

        connectionRef.current.on('signal', data => {
          connectionRef.current.signal(data);
        })

        connectionRef.current.on("stream", otherStream => {
          if (userVideo.current) userVideo.current.srcObject = otherStream;
        });


      } else if (user.type === 'teacher') {
        connectionRef.current = new Peer({initiator: false, trickle: false, stream: stream});

        connectionRef.current.on('signal', data => {
          connectionRef.current.signal(data)
        })

        connectionRef.current.on("stream", otherStream => {
          if (userVideo.current) userVideo.current.srcObject = otherStream;
        });
      }
    }

  }, [captureVideo, captureAudio])

  // Необходимые приготовления
  const setup = () => {
    const user = getUser()

    // Добавляем в список подключений
    socket.emit('add-to-video', {login: user.login});

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((currentStream) => {
        setStream(currentStream.clone());
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });


    socket.on('student-calling', ({studentLogin, signal}) => {
      setReceivingCall(true);
      setCaller(studentLogin);
      setCallerSignal(signal);
    });

    socket.on('caller-ended-call', () => {
      hangUp();
    });

  }

  const answerCall = (studentLogin) => {
    const user = getUser()
    stream.getVideoTracks().forEach(track => track.enabled = captureVideo);
    stream.getAudioTracks().forEach(track => track.enabled = captureAudio);

    const teacherPeer = new Peer({initiator: false, trickle: false, stream: stream});

    teacherPeer.on('signal', data => {
      setCallAccepted(true);
      setReceivingCall(false);
      socket.emit('call-accepted', {teacherLogin: user.login, studentLogin, signal: data});
    })

    teacherPeer.on("stream", otherStream => {
      if (userVideo.current) userVideo.current.srcObject = otherStream;
    });

    teacherPeer.on('close', () => hangUp())

    teacherPeer.signal(callerSignal)
    // teacherPeer._debug = console.log

    connectionRef.current = teacherPeer;
  };

  const callTeacher = (teacherLogin) => {
    const user = getUser();
    stream.getVideoTracks().forEach(track => track.enabled = captureVideo);
    stream.getAudioTracks().forEach(track => track.enabled = captureAudio);

    setCalling(true);

    if (connectionRef.current.destroy) connectionRef.current.destroy();

    const studentPeer = new Peer({initiator: true, trickle: false, stream: stream})

    studentPeer.on('signal', data => {
      socket.emit('call-teacher', {teacherLogin, studentLogin: user.login, signalData: data});
    })

    studentPeer.on("stream", otherStream => {
      if (userVideo.current) userVideo.current.srcObject = otherStream;
    });

    socket.on('teacher-accepted-call', ({teacherLogin, signal}) => {
      setCaller(teacherLogin);
      setCalling(false);
      setCallAccepted(true);

      connectionRef.current.signal(signal);
    });


    studentPeer.on('error', (err) => {
      console.error(err)
      // alert('При передаче видео произошла ошибка, обновите страницу')
      // window.location.reload();
    })

    studentPeer.on('close', () => hangUp())

    // studentPeer._debug = console.log

    connectionRef.current = studentPeer;
  };

  const leaveCall = () => {
    socket.emit('call-ended', {caller})
    hangUp();
  };

  const hangUp = () => {
    setReceivingCall(false);
    setCallAccepted(false);
    setCalling(false);

    connectionRef.current.destroy();
    window.location.reload();
  }

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
      setCaptureVideo,
      setCaptureAudio,
    }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export {VideoContextProvider, VideoContext};
