import React, {useContext, useEffect} from 'react';
import {FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute, FaPhone, FaPhoneSlash} from 'react-icons/fa';

import {VideoContext} from "../../../context/VideoContext";

import './VideoArea.scss';
import PropTypes from "prop-types";
import {useUser} from "../../../hooks/useUser";

const VideoArea = ({room}) => {
  const {
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
  } = useContext(VideoContext);


  useEffect(()=>{
    setup(room)
  }, [])

  const {getUser} = useUser();
  const user = getUser();

  return (
    <div className={"video-wrapper"}>
      <div className={"teacher-video video"}>
        <video
          ref={myVideo}
          muted
          autoPlay
          className="my-video"
        />

        <div className={'video-buttons start-call-buttons'}>
          {!callAccepted ?
            <React.Fragment>{
              user.type === 'student' ?
                <div className='video-button green' onClick={() => callTeacher(room)}><FaPhone/></div> :
                <div className='video-button green' onClick={() => answerCall(caller)}><FaPhone/></div>
            }</React.Fragment> :
            <React.Fragment>{
              user.type === 'student' ?
                <div className='video-button green' onClick={() => leaveCall(room)}><FaPhoneSlash/></div> :
                <div className='video-button green' onClick={() => leaveCall(caller)}><FaPhoneSlash/></div>
            }</React.Fragment>
          }
        </div>

        <div className={'video-buttons'}>
          {captureVideo && !captureNone ?
            <div className={'video-button stop-video'} onClick={() => setVideo(false)}><FaVideoSlash/></div> :
            <div className={'video-button start-video'} onClick={() => setVideo(true)}><FaVideo/></div>}

          {captureAudio && !captureNone ?
            <div className={'video-button stop-audio'} onClick={() => setAudio(false)}><FaVolumeMute/></div> :
            <div className={'video-button start-audio'} onClick={() => setAudio(true)}><FaVolumeUp/></div>}
        </div>

      </div>
      <div className={"student-video video"}>
        <video
          ref={userVideo}
          autoPlay
          className="accepted-video"
        />
      </div>
    </div>
  )
}

VideoArea.propTypes = {
  room: PropTypes.string.isRequired,
}

export default VideoArea;