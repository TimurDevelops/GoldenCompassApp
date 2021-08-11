import React from "react";
import PropTypes from "prop-types";

const SlideItem = ({setSlide, slide}) => {

  return (
    <div className={'item-wrapper slide'} onClick={setSlide}>
      <div className={'img-wrapper'}>
        <img src={slide.img} alt="Слайд"/>
      </div>
    </div>
  )
}

SlideItem.propTypes = {
  setSlide: PropTypes.func.isRequired,
  slide: PropTypes.object.isRequired,
}

export default SlideItem;
