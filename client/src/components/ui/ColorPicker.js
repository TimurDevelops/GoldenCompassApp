import React, {useState} from "react";
import PropTypes from "prop-types";

import './ColorPicker.scss';

const ColorPicker = ({onChangeComplete, color}) => {
  const [open, setOpen] = useState(false)
  const [activeColor, setActiveColor] = useState(color)
  let colors = [
    'red',
    'blue',
    'yellow',
    'green',
    'black',
    'grey',
    'white',
  ]


  return (

    <div className={'wrapper'}>
      <div className={'trigger'} onClick={() => {
        setOpen(!open)
      }}>
        <div className={'trigger-color-wrapper'}>
          <span className={'trigger-color ' + activeColor}/>
        </div>
      </div>


      {open && <div className={'color-picker-wrapper'}>
        {colors.map(i =>
          <div onClick={
            () => {
              onChangeComplete(i);
              setActiveColor(i);
              setOpen(false)
            }
          } className={`color-wrapper ${activeColor === i && 'active'}`} key={i}>
            <span className={'color ' + i}/>
          </div>
        )
        }
      </div>}

    </div>

  )
}

ColorPicker.propTypes =
  {
    onChangeComplete: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
}

export default ColorPicker;