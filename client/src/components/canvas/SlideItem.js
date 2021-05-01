import React from "react";
import PropTypes from "prop-types";

const SlideItem = ({setSlide, slide}) => {

  return (
    <div onClick={setSlide(slide.id)}>
      {slide.img}
      <div>Урок Номер 1</div>
    </div>
  )
}

SlideItem.propTypes = {
  setSlide: PropTypes.func.isRequired,
  slide: PropTypes.object.isRequired,
}

export default SlideItem;
