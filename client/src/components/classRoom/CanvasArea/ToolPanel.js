import React, {useState} from 'react';
import PropTypes from "prop-types";
import {FaPencilAlt, FaEraser, FaUndo, FaSyncAlt, FaMousePointer, FaClock, FaMinusCircle} from 'react-icons/fa';

import "./ToolPanel.scss";
import Switch from "../../ui/Switch";
import useInterval from "../../../utils/useInterval";
import {TOOLS} from "../../../utils/types";

const ToolPanel = ({setActiveTool, setDrawWidth, setDrawColor, setStudentAllowedToDraw}) => {

  const [timerRunning, setTimerRunning] = useState(false);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const resetTimer =() => {
    setSecond(0);
    setMinute(0);
    setTimerRunning(false);
  }

  useInterval(() => {
    if (second < 59) {
      setSecond(second + 1);
    } else {
      setSecond(0);
      setMinute(minute + 1);
    }
  }, timerRunning ? 1000 : null)

  return (

    <div className={"tool-panel"}>
      <div className={'tool-btn'}><FaUndo/></div>
      <div className={'tool-btn'} onClick={() => {
        setActiveTool(TOOLS.PENCIL)
      }}><FaPencilAlt/></div>
      <div>
        <select onChange={e => setDrawWidth(e.target.value)}>
          <option defaultChecked={true} value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={150}>150</option>
        </select>

        <select onChange={e => setDrawColor(e.target.value)}>
          <option defaultChecked={true} value={'red'}>Red</option>
          <option value={'white'}>White</option>
          <option value={'black'}>Black</option>
          <option value={'grey'}>Grey</option>
        </select>
      </div>

      <div className={'tool-btn'} onClick={() => {
        setActiveTool(TOOLS.ERASER)
      }}><FaEraser/></div>
      <div className={'tool-btn'} onClick={() => {
        setActiveTool(TOOLS.CURSOR)
      }}><FaMousePointer/></div>

      <div className={'border'}>

        <div className={'tool-btn'} onClick={() => {
          setTimerRunning(!timerRunning);
        }}><FaClock/></div>
        <div className={'time-holder'}>
          <span className={'minute'}>{minute < 10 ? '0' + minute : minute}</span>
          <span className={'colon'}>:</span>
          <span className={'seconds'}>{second < 10 ? '0' + second : second}</span>
        </div>
        <div className={'tool-btn red'} onClick={() => {
          resetTimer();
        }}><FaMinusCircle/></div>


      </div>

      <Switch labelOne="" labelTwo="" valueOne={true} valueTwo={false}
              onChange={(value) => {
                setStudentAllowedToDraw(value);
              }}/>

      <div className={'tool-btn'} onClick={() => {
        setSecond(second+1)
      }}><FaSyncAlt/></div>

    </div>
  )
}

ToolPanel.propTypes = {
  setActiveTool: PropTypes.func.isRequired,
  setStudentAllowedToDraw: PropTypes.func.isRequired,
  setDrawWidth: PropTypes.func.isRequired,
  setDrawColor: PropTypes.func.isRequired,
}

export default ToolPanel;