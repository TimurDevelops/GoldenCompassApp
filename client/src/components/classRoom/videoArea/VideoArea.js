import React, {useContext} from 'react';
// import {FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute} from 'react-icons/fa';

import {VideoContext} from "../../../context/VideoContext";
import {useUser} from "../../../hooks/useUser";

import './VideoArea.scss';
import PropTypes from "prop-types";

const VideoArea = ({room}) => {
  const {myVideo, userVideo} = useContext(VideoContext);

  // const [captureVideo, setCaptureVideo] = useState(true);
  // const [captureAudio, setCaptureAudio] = useState(true);

  // try {
  //   navigator.getUserMedia(
  //     {
  //       video: captureVideo,
  //       audio: captureAudio,
  //     },
  //     (stream) => {
  //
  //
  //       let video = document.getElementsByClassName('app__videoFeed')[0];
  //       if (video) {
  //         video.srcObject = stream;
  //       }
  //     },
  //     (err) => console.error(err)
  //   );
  // } catch (e) {
  //   console.log(e);
  // }


  return (
    <div className={"video-wrapper"}>
      <div className={"teacher-video video"}>
        <video
          ref={myVideo}
          autoPlay
          className="my-video"
        />
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

  // return (
  //   <div className={"video-wrapper"}>
  //     <div className={"teacher-video video"}>
  //       {captureVideo || captureAudio ? <video
  //         ref={myVide o}
  //         autoPlay
  //         className="app__videoFeed"
  //       /> : <div>
  //         <div className={'video-off-screen'}><FaVideoSlash/></div>
  //       </div>}
  //       <div className={'video-buttons'}>
  //         {!captureVideo ?
  //           <div className={'video-button start-video'} onClick={() => setCaptureVideo(true)}><FaVideo/></div> :
  //           <div className={'video-button stop-video'} onClick={() => setCaptureVideo(false)}><FaVideoSlash/></div>}
  //
  //         {!captureAudio ?
  //           <div className={'video-button start-audio'} onClick={() => setCaptureAudio(true)}><FaVolumeUp/></div> :
  //           <div className={'video-button stop-audio'} onClick={() => setCaptureAudio(false)}><FaVolumeMute/></div>}
  //       </div>
  //     </div>
  //     <div className={"student-video video"}>
  //       {captureVideo || captureAudio ? <video
  //         ref={myV ideo}
  //         autoPlay
  //         className="acceptedVideo"
  //       /> : <div>
  //         <div className={'video-off-screen'}><FaVideoSlash/></div>
  //       </div>}
  //       <div className={'video-buttons'}>
  //         {!captureVideo ?
  //           <div className={'video-button start-video'} onClick={() => setCaptureVideo(true)}><FaVideo/></div> :
  //           <div className={'video-button stop-video'} onClick={() => setCaptureVideo(false)}><FaVideoSlash/></div>}
  //
  //         {!captureAudio ?
  //           <div className={'video-button start-audio'} onClick={() => setCaptureAudio(true)}><FaVolumeUp/></div> :
  //           <div className={'video-button stop-audio'} onClick={() => setCaptureAudio(false)}><FaVolumeMute/></div>}
  //       </div>
  //     </div>
  //   </div>
  // )
}

VideoArea.propTypes = {
  room: PropTypes.string.isRequired,
};

export default VideoArea;