import React from "react";
import PropTypes from "prop-types";

const SlideItem = ({setSlide, slide}) => {

  return (
    <div className={`item-wrapper slide ${slide.img ? '' : 'empty'}`} onClick={setSlide}>
      <div className={'img-wrapper'}>

        {slide.img ? <img src={slide.img} alt="Слайд"/> : <div className={'content'}>Для учителя</div>}

      </div>
    </div>
  )
}

SlideItem.propTypes = {
  setSlide: PropTypes.func.isRequired,
  slide: PropTypes.object.isRequired,
}

export default SlideItem;
