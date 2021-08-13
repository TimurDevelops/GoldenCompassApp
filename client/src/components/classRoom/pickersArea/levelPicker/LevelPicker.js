import React from "react";
import PropTypes from "prop-types";
import LevelItem from "./LevelItem";

const LevelPicker = ({open, setOpen, levels, setLevel}) => {
  return (
    <div className={`item-picker level-picker ${open ? 'open' : ''}`}>
      <div className={`picker-area`}>
        <div className={'picker-menu-bg'} onClick={() => setOpen(false)}/>

        <div className={'picker-items levels'}>
          {levels.map(level => <LevelItem key={level._id} setLevel={() => setLevel(level)} level={level}/>)}
        </div>
      </div>
    </div>
  )
}

LevelPicker.propTypes = {
  levels: PropTypes.array.isRequired,
  setLevel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default LevelPicker;
