import React from "react";
import PropTypes from "prop-types";

const SlidePicker = ({setLesson}) => {

  return (
    <div>
      <button onClick={setLesson(1)}>Урок Номер 1</button>
      <button onClick={setLesson(2)}>Урок Номер 2</button>
      <button onClick={setLesson(3)}>Урок Номер 3</button>
    </div>
  )
}

SlidePicker.propTypes = {
  setLesson: PropTypes.func.isRequired,
}

export default SlidePicker;
