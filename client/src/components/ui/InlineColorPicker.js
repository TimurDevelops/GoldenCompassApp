import React, {useState} from "react";
import PropTypes from "prop-types";

import './InlineColorPicker.scss';

const InlineColorPicker = ({color, onChangeComplete}) => {
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

    <div className={'inline-color-picker-wrapper'}>
      <div className={'p-item-picker-wrapper'}>

        {colors.map(i =>
          <div onClick={
            () => {
              onChangeComplete(i);
              setActiveColor(i);
            }
          } className={`p-item-wrapper ${activeColor === i ? 'active' : ''}`} key={i}>
            <span className={`p-item ${i}`}/>
          </div>
        )}
      </div>
    </div>
  )
}

InlineColorPicker.propTypes = {
  color: PropTypes.any.isRequired,
  onChangeComplete: PropTypes.func.isRequired,
}

export default InlineColorPicker;