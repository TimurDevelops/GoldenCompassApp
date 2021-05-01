import React from 'react';
import PropTypes from "prop-types";

const TipArea = ({tip}) => {

  return (
    <div>
      {tip}
    </div>
  )
}

TipArea.propTypes = {
  tip: PropTypes.string.isRequired,
}

export default TipArea;