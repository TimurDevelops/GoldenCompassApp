import React from 'react';

import "./VideoArea.scss";

const VideoArea = () => {

  return (
    <div className={"video-wrapper"}>
      <div className={"teacher-video video"}><span>Здесь будет видео учителя</span></div>
      <div className={"student-video video"}><span>Здесь будет видео студента</span></div>
    </div>
  )
}

export default VideoArea;