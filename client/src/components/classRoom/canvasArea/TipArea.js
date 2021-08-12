import React from 'react';
import PropTypes from "prop-types";

const TipArea = ({tip, displayTip}) => {

  return (
    <div className={"tip-area"}>
      <div className={"tip-text"}>
        {displayTip && <p>{tip || ""}</p>}
      </div>
    </div>
  )
}

TipArea.propTypes = {
  tip: PropTypes.string,
  displayTip: PropTypes.bool.isRequired,
}

export default TipArea;