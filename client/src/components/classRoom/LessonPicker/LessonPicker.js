import React from "react";
import PropTypes from "prop-types";
import LessonItem from "./LessonItem";

import './LessonPicker.scss';

const LessonPicker = ({setLesson, lessons, open, setOpen, buttonVisible}) => {
  return (
    <div className={`lesson-picker ${open ? 'open' : ''} ${buttonVisible ? '' : 'hidden'}`}>
      <div className={`picker-area`}>
        <div className={'bg'} onClick={() => setOpen(false)}/>

        <div className={'lessons'}>
          {lessons.map(lesson => <LessonItem key={lesson._id} setLesson={setLesson} lesson={lesson}/>)}
        </div>

        <div className={'menu-bg'}/>
      </div>

      <div className={`button-holder`}>
        <div className={'button'} onClick={() => setOpen(!open)}>Уроки</div>
      </div>
    </div>
  )
}

LessonPicker.propTypes = {
  setLesson: PropTypes.func.isRequired,
  lessons: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  buttonVisible: PropTypes.bool.isRequired,
}

export default LessonPicker;
