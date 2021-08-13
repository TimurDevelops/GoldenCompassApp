import React from "react";
import PropTypes from "prop-types";

const LevelItem = ({setLevel, level}) => {
  return (
    <div className={'item-wrapper'} onClick={setLevel}>
      <div className={'item'}>{level.name}</div>
    </div>
  )
}

LevelItem.propTypes = {
  setLevel: PropTypes.func.isRequired,
  level: PropTypes.object.isRequired,
}

export default LevelItem;