import React from "react";
import PropTypes from "prop-types";

const LevelItem = ({setLevel, level}) => {
  return (
    <button onClick={() => setLevel(level)}>{level.name}</button>
  )
}

LevelItem.propTypes = {
  setLevel: PropTypes.func.isRequired,
  level: PropTypes.object.isRequired,
}

export default LevelItem;