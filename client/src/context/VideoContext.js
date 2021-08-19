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

  useEffect(() => {
    const user = getUser();
    if (callAccepted){

      stream.getVideoTracks().forEach(track => track.enabled = captureVideo);
      stream.getAudioTracks().forEach(track => track.enabled = captureAudio);

      if(user.type === 'student'){
        connectionRef.current = new Peer({initiator: false, trickle: false, stream: stream})

        connectionRef.current.on('signal', data => {
          connectionRef.current.signal(data);
        })

        connectionRef.current.on("stream", otherStream => {
          if (userVideo.current) userVideo.current.srcObject = otherStream;
        });


      } else if (user.type === 'teacher'){
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

  const setup = () => {
    const user = getUser()

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

  }

  const answerCall = (studentLogin) => {
    stream.getVideoTracks().forEach(track => track.enabled = captureVideo);
    stream.getAudioTracks().forEach(track => track.enabled = captureAudio);

    const teacherPeer = new Peer({initiator: false, trickle: false, stream: stream});

    teacherPeer.on('signal', data => {
      setCallAccepted(true);
      setReceivingCall(false);
      socket.emit('call-accepted', {studentLogin, signal: data});
    })

    teacherPeer.on("stream", otherStream => {
      if (userVideo.current) userVideo.current.srcObject = otherStream;
    });

    teacherPeer.signal(callerSignal)

    connectionRef.current = teacherPeer;
  };

  const callTeacher = (teacherLogin) => {
    const user = getUser();
    stream.getVideoTracks().forEach(track => track.enabled = captureVideo);
    stream.getAudioTracks().forEach(track => track.enabled = captureAudio);

    const studentPeer = new Peer({initiator: true, trickle: false, stream: stream})

    studentPeer.on('signal', data => {
      setCalling(true);
      socket.emit('call-teacher', {teacherLogin, studentLogin: user.login, signalData: data});
    })

    studentPeer.on("stream", otherStream => {
      console.log(otherStream)
      if (userVideo.current) userVideo.current.srcObject = otherStream;
    });

    socket.on('teacher-accepted-call', ({signal}) => {
      setCalling(false);
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
      setCaptureVideo,
      setCaptureAudio,
    }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export {VideoContextProvider, VideoContext};
