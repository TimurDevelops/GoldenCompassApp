import React from "react";
import PropTypes from "prop-types";

import './Checkbox.scss'

const Checkbox = ({label, name, value, onChange}) => {

  return (
    <div className="radio">
      <input className="custom-radio" type="radio" id={"color-" + value} name={name} value={value}
             onClick={e => onChange(e.currentTarget.value)}/>
      <label htmlFor={"color-" + value}>{label}</label>
    </div>
  );
}


Checkbox.propTypes = {
  label: PropTypes.any.isRequired,
  name: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Checkbox;