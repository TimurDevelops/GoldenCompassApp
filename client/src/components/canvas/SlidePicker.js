import React from "react";
import PropTypes from "prop-types";
import SlideItem from "./SlideItem";

const SlidePicker = ({slides, setSlide}) => {
  return (
    <div>
      {slides.map(slide => <SlideItem key={slide.id} setSlide={setSlide} slide={slide}/>)}
    </div>
  )
}

SlidePicker.propTypes = {
  slides: PropTypes.array.isRequired,
}

export default SlidePicker;





