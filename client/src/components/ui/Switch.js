import React from "react";
import PropTypes from "prop-types";
import './Switch.scss'

const Switch = ({labelOne, labelTwo, onChange, valueOne, valueTwo}) => {
  const switchChange = (checked) => {
    onChange(checked ? valueTwo : valueOne);
  }

  return (
    <div className="switch">
      {labelOne !== '' ? <div className="label">{labelOne}</div> : ''}

      <label className="toggle-control">
        <input type="checkbox" onChange={e => switchChange(e.target.checked)}/>
        <span className="control"/>
      </label>

      {labelTwo !== '' ? <div className="label">{labelTwo}</div> : ''}
    </div>
  );
}

Switch.propTypes = {
  labelOne: PropTypes.string.isRequired,
  labelTwo: PropTypes.string.isRequired,
  valueOne: PropTypes.any.isRequired,
  valueTwo: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Switch;