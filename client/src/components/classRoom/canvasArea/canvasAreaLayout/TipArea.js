import React from 'react';
import PropTypes from "prop-types";

const TipArea = ({tip}) => {
  // TODO получать из контекста allowedToDraw

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
}

export default TipArea;