import React, {createContext, useState, useRef, useEffect} from 'react';
import Peer from 'simple-peer';
import {useSocket} from "../hooks/useSocket";
import {useUser} from "../hooks/useUser";

const VideoContext = createContext('');

const VideoContextProvider = ({children}) => {
  const {user} = useUser();
  const {socket} = useSocket();

  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef({});

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((currentStream) => {
        console.log(currentStream)
        setStream(currentStream);

        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on('call-user', ({from, name: callerName, signal}) => {
      console.log('call-user')

      setCall({isReceivingCall: true, from, name: callerName, signal});
    });

  }, [socket, myVideo]);

  useEffect(() => {
    console.log(call.isReceivingCall)
    if (call.isReceivingCall) {
      answerCall();
    }
  }, [call]);


  const answerCall = () => {
    console.log('answerCall')
    const peer = new Peer({initiator: false, trickle: false, stream});

    peer.on('signal', (data) => {
      socket.emit('call-accepted', {signal: data, to: call.from});
    });

    peer.on('stream', (currentStream) => {
      console.log(currentStream)
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (teacherLogin) => {
    console.log(teacherLogin)
    const peer = new Peer({initiator: true, trickle: false, stream});

    peer.on('signal', (data) => {
      socket.emit('call-user', {teacherLogin, signalData: data, from: user.login, name});
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on('call-accepted', (signal) => {
      console.log(signal)
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  return (
    <VideoContext.Provider value={{
      call,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callUser,
      answerCall,
    }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export {VideoContextProvider, VideoContext};
