import React, {useContext, useEffect} from 'react';
import {FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute, FaPhone} from 'react-icons/fa';

import PropTypes from "prop-types";
import {useUser} from "../../../hooks/useUser";

import {VideoContext} from "../../../context/VideoContext";

import './VideoArea.scss';

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
    // leaveCall,

    captureVideo,
    captureAudio,
    setCaptureVideo,
    setCaptureAudio,

  } = useContext(VideoContext);


  useEffect(() => {
    setup()
  }, [])

  const {getUser} = useUser();
  const user = getUser();

  return (
    <div className={"video-wrapper"}>

      {calling && <div className={'notification'}>
        <div className={'notification-inner'}>Отправлен вызов учителю</div>
      </div>}

      {receivingCall && <div className={'notification'}>
        <div className={'notification-inner'}>Ученик вас вызывает</div>
      </div>}

      {!callAccepted && !calling && user.type === 'student' && <div className={'notification'}>
        <div className={'notification-inner'}>Чтобы начать видеосвязь, нажмите на кнопку над вашим видео</div>
      </div>}

      <div className={"teacher-video video"}>
        <video
          ref={myVideo}
          muted
          autoPlay
          className="my-video"
        />

        <div className={'video-buttons start-call-buttons'}>
          {
            user.type === 'student' ?
              <div className='video-button green' onClick={() => callTeacher(room)}><FaPhone/></div> :
              receivingCall ?
                <div className='video-button green' onClick={() => answerCall(caller)}><FaPhone/></div> : ''
          }
        </div>

        <div className={'video-buttons'}>
          {captureVideo ?
            <div className={'video-button stop-video'} onClick={() => setCaptureVideo(false)}><FaVideoSlash/></div> :
            <div className={'video-button start-video'} onClick={() => setCaptureVideo(true)}><FaVideo/></div>}

          {captureAudio ?
            <div className={'video-button stop-audio'} onClick={() => setCaptureAudio(false)}><FaVolumeMute/></div> :
            <div className={'video-button start-audio'} onClick={() => setCaptureAudio(true)}><FaVolumeUp/></div>}
        </div>
      </div>

      <div className={'video-border'}/>

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