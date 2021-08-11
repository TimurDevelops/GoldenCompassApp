import React, {useState} from "react";
import PropTypes from "prop-types";

import './Picker.scss';

const Picker = ({defaultValue, values, valueField, labelField, onChangeComplete}) => {

  const [open, setOpen] = useState(false)

  const defItem = values.find((i) => i[valueField] === defaultValue)

  const [activeItem, setActiveItem] = useState(defItem)

  return (

    <div className={'picker-wrapper'}>
      <div className={'trigger'} onClick={() => {
        setOpen(!open)
      }}>
        <div className={'trigger-p-item-wrapper'}>
          <span className={'trigger-p-item '}>{activeItem[labelField]}</span>
        </div>
      </div>

      {open && <div className={'wrapper-bg'} onClick={() => {
        setOpen(false)
      }}/>}
      {open && <div className={'p-item-picker-wrapper'}>

        {values.map(i =>
          <div onClick={
            () => {
              onChangeComplete(i[valueField]);
              setActiveItem(i);
              setOpen(false)
            }
          } className={`p-item-wrapper ${activeItem === i ? 'active' : ''}`} key={i[valueField]}>
            <span className={'p-item'}>{i[labelField]}</span>
          </div>
        )}
      </div>}
    </div>
  )
}

Picker.propTypes = {
  defaultValue: PropTypes.any.isRequired,
  values: PropTypes.array.isRequired,
  valueField: PropTypes.string.isRequired,
  labelField: PropTypes.string.isRequired,
  onChangeComplete: PropTypes.func.isRequired,
}

export default Picker;