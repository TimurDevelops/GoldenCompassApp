import React, {useState} from 'react';
import {FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute} from 'react-icons/fa';

import io from 'socket.io-client';

import {serverUrl} from '../../../config.json';
import './VideoArea.scss';

const socket = io(serverUrl, {transports: ['websocket'], upgrade: false});


const VideoArea = () => {

  const [captureVideo, setCaptureVideo] = useState(true);
  const [captureAudio, setCaptureAudio] = useState(true);

  try{
    navigator.getUserMedia(
      {
        video: captureVideo,
        audio: captureAudio,
      },
      (stream) => {


        let video = document.getElementsByClassName('app__videoFeed')[0];
        if (video) {
          video.srcObject = stream;
        }
      },
      (err) => console.error(err)
    );
  } catch (e) {
    console.log(e);
  }

  return (
    <div className={"video-wrapper"}>
      <div className={"teacher-video video"}>
        {captureVideo || captureAudio ? <video
          autoPlay
          className="app__videoFeed"
        /> : <div>
          <div className={'video-off-screen'}><FaVideoSlash/></div>
        </div>}
        <div className={'video-buttons'}>
          {!captureVideo ?
            <div className={'video-button start-video'} onClick={() => setCaptureVideo(true)}><FaVideo/></div> :
            <div className={'video-button stop-video'} onClick={() => setCaptureVideo(false)}><FaVideoSlash/></div>}

          {!captureAudio ?
            <div className={'video-button start-audio'} onClick={() => setCaptureAudio(true)}><FaVolumeUp/></div> :
            <div className={'video-button stop-audio'} onClick={() => setCaptureAudio(false)}><FaVolumeMute/></div>}
        </div>
      </div>
      <div className={"student-video video"}><span>Здесь будет видео студента</span></div>
    </div>
  )
}

export default VideoArea;