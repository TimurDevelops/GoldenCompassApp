import React from "react";
import PropTypes from "prop-types";
import LessonItem from "./LessonItem";

const LessonPicker = ({open, setOpen, lessons, setLesson}) => {
  return (
    <div className={`item-picker lesson-picker ${open ? 'open' : ''}`}>
      <div className={`picker-area`}>
        <div className={'picker-menu-bg'} onClick={() => setOpen(false)}/>

        <div className={'picker-items levels'}>
          {lessons.map(lesson => <LessonItem key={lesson._id} setLesson={setLesson} lesson={lesson}/>)}
        </div>
      </div>
    </div>
  )
}

LessonPicker.propTypes = {
  setLesson: PropTypes.func.isRequired,
  lessons: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default LessonPicker;
