import React from "react";
import PropTypes from "prop-types";

import './Checkbox.scss'

const Checkbox = ({label, name, value, onChange, checked}) => {

  return (
    <div className="radio">
      <input className="custom-radio" type="radio" id={"color-" + value} name={name} value={value} defaultChecked={checked}
             onClick={e => onChange(e.currentTarget.value)}/>
      <label htmlFor={"color-" + value}>{label}</label>
    </div>
  );
}


Checkbox.propTypes = {
  label: PropTypes.any.isRequired,
  name: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool
}

export default Checkbox;