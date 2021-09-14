import React, {useState} from "react";
import PropTypes from "prop-types";

import './InlinePicker.scss';

const InlinePicker = ({defaultValue, values, valueField, onChangeComplete}) => {
  const defItem = values.find((i) => i[valueField] === defaultValue)

  const [activeItem, setActiveItem] = useState(defItem)
  return (

    <div className={'inline-picker-wrapper'}>
      <div className={'p-item-picker-wrapper'}>

        {values.map(i =>
          <div onClick={
            () => {
              onChangeComplete(i[valueField]);
              setActiveItem(i);
            }
          } className={`p-item-wrapper ${activeItem.value === i.value ? 'active' : ''}`} key={i[valueField]}>
            <span className={`p-item size${i[valueField]}`}/>
          </div>
        )}
      </div>
    </div>
  )
}

InlinePicker.propTypes = {
  defaultValue: PropTypes.any.isRequired,
  values: PropTypes.array.isRequired,
  valueField: PropTypes.string.isRequired,
  onChangeComplete: PropTypes.func.isRequired,
}

export default InlinePicker;