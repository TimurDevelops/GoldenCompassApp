import React from "react";
import PropTypes from "prop-types";
import LessonItem from "./LessonItem";

const LessonPicker = ({open, setOpen, lessons, setLesson}) => {
  return (
    <div className={`item-picker lesson-picker ${open ? 'open' : ''}`}>
      <div className={`picker-area`}>
        <div className={'picker-menu-bg'} onClick={() => setOpen(false)}/>

        <div className={'picker-items levels'}>
          {lessons && lessons.map(lesson => <LessonItem key={lesson._id} setLesson={() => setLesson(lesson)} lesson={lesson}/>)}
        </div>
      </div>
    </div>
  )
}

LessonPicker.propTypes = {
  lessons: PropTypes.array,
  setLesson: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default LessonPicker;
