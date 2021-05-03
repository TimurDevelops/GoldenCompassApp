import React from "react";
import PropTypes from "prop-types";

const LessonPicker = ({setLesson}) => {

  return (
    <div>
      <button onClick={
        () => setLesson({
          slides: [
            {img: 'a image', id: 1, tip: "Tip for teacher"}
          ]
        })
      }>Урок Номер 1
      </button>

      <button onClick={
        () => setLesson({
          slides: [
            {img: 'b image', id: 1, tip: "Tip for teacher"}, {img: 'b image two', id: 2, tip: "Tip for teacher"}
          ]
        })
      }>Урок Номер 2
      </button>

      <button onClick={
        () => setLesson({
          slides: [
            {img: 'c image', id: 1, tip: "Tip for teacher"}, {img: 'c image two', id: 2, tip: "Tip for teacher"}
          ]
        })
      }>Урок Номер 3
      </button>

    </div>
  )
}

LessonPicker.propTypes = {
  setLesson: PropTypes.func.isRequired,
}

export default LessonPicker;
