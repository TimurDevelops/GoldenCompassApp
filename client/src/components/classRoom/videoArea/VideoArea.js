import React, {useContext} from 'react';
import {FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute} from 'react-icons/fa';

import {VideoContext} from "../../../context/VideoContext";

import './VideoArea.scss';
import PropTypes from "prop-types";
import {useUser} from "../../../hooks/useUser";

const VideoArea = ({room}) => {
  const {
    joinVideoSocket,
    callTeacher,
    myVideo,
    userVideo,
    captureVideo,
    captureAudio,
    captureNone,
    setVideo,
    setAudio,
  } = useContext(VideoContext);

  const {getUser} = useUser();

  const user = getUser();
  console.log(user)
  joinVideoSocket(user.login);

  if (user.type === 'student') {
    callTeacher(room)
  }

  return (
    <div className={"video-wrapper"}>
      <div className={"teacher-video video"}>
        <video
          ref={myVideo}
          muted
          autoPlay
          className="my-video"
        />

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