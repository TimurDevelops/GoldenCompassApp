import React from "react";
import PropTypes from "prop-types";

const SlideItem = ({setSlide, slide}) => {

  return (
    <button onClick={() => setSlide(slide)}>
      <div>{slide.img}</div>
    </button>
  )
}

SlideItem.propTypes = {
  setSlide: PropTypes.func.isRequired,
  slide: PropTypes.object.isRequired,
}

export default SlideItem;
