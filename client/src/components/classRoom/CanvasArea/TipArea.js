import React from 'react';
import PropTypes from "prop-types";

import "./TipArea.scss"

const TipArea = ({tip}) => {

  return (
    <div className={"tip-area"}>
      {tip}
    </div>
  )
}

TipArea.propTypes = {
  tip: PropTypes.string.isRequired,
}

export default TipArea;