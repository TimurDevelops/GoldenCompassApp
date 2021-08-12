import React from "react";
import PropTypes from "prop-types";
import SlideItem from "./SlideItem";

const SlidePicker = ({open, setOpen, slides, setSlide}) => {
  return (
    <div className={`item-picker slide-picker ${open ? 'open' : ''}`}>
      <div className={`picker-area`}>
        <div className={'picker-menu-bg'} onClick={() => setOpen(false)}/>

        <div className={'picker-items slides'}>
          {slides && slides.map(slide => <SlideItem key={slide._id} setSlide={() => setSlide(slide)} slide={slide}/>)}
          <div className={'item-wrapper slide empty'} onClick={() => setSlide({img: '', tip: ''})}>
            <div className={'img-wrapper'}>
              <div className={'content'}>
                Пустой слайд
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SlidePicker.propTypes = {
  slides: PropTypes.array,
  setSlide: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default SlidePicker;
