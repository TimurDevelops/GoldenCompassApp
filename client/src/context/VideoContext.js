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

  const [connected, setConnected] = useState(true);
  const [captureVideo, setCaptureVideo] = useState(true);
  const [captureAudio, setCaptureAudio] = useState(true);
  const [captureNone, setCaptureNone] = useState(false);


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

  socket.on('student-calling', ({studentLogin}) => {
    console.log('student-calling')

    answerCall(studentLogin);
  });

  const joinVideoSocket = (login) => {
    console.log('joinVideoSocket')

    socket.emit('add-to-video', {login});
  }

  const answerCall = (studentLogin) => {
    console.log('answerCall')
    socket.emit('call-accepted', {studentLogin});

    navigator.mediaDevices.getUserMedia({video: captureVideo, audio: captureAudio})
      .then((currentStream) => {
        console.log('student signals')
        if (myVideo.current) myVideo.current.srcObject = currentStream;

        if (captureNone) return

        const peer1 = new Peer({initiator: true, stream: currentStream})
        const peer2 = new Peer()

        peer1.on('signal', data => {
          peer2.signal(data)
        })

        peer2.on('signal', data => {
          peer1.signal(data)
        })

        peer2.on('stream', stream => {
          console.log('student signals')

          if (userVideo.current) userVideo.current.srcObject = stream;
        })

      });
  };

  const callTeacher = (teacherLogin) => {
    console.log('callTeacher')
    const user = getUser();
    socket.emit('call-teacher', {teacherLogin, studentLogin: user.login});

    socket.on('teacher-accepted-call', () => {
      console.log('teacher-accepted-call')
      connect();
    });

    const connect = () => {
      console.log(connected)
      if (connected) return

      setConnected(true)
      navigator.mediaDevices.getUserMedia({video: captureVideo, audio: captureAudio})
        .then((currentStream) => {
          if (myVideo.current) myVideo.current.srcObject = currentStream;

          // if (captureNone) return
          //
          // const peer1 = new Peer({initiator: true, stream: currentStream})
          // const peer2 = new Peer()
          //
          // peer1.on('signal', data => {
          //   console.log('peer1 signal')
          //   peer2.signal(data)
          // })
          //
          // peer2.on('signal', data => {
          //   console.log('peer2 signal')
          //
          //   peer1.signal(data)
          // })
          //
          // peer2.on('stream', stream => {
          //   console.log('peer2 stream')
          //
          //   if (userVideo.current) userVideo.current.srcObject = stream;
          // })

        });
    }
  };

  return (
    <VideoContext.Provider value={{
      myVideo,
      userVideo,
      joinVideoSocket,
      callTeacher,
      answerCall,
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
