import React from 'react';
import PropTypes from "prop-types";
import {FaPencilAlt, FaEraser, FaUndo, FaSyncAlt, FaMousePointer, FaClock} from 'react-icons/fa';

import "./ToolPanel.scss";
import Switch from "../../ui/Switch";

const ToolPanel = ({setActiveTool, setDrawWidth, setDrawColor, setStudentAllowedToDraw, undo}) => {
  // TODO сделать названия инструментов глобальными

  const timerRunning = false;

  const timerClicked = () => {
    if(timerRunning){
      startTimer();
    }else{
      stopTimer();
    }
  }
  const startTimer = () => {

  }
  const stopTimer = () => {

  }

  return (

    <div className={"tool-panel"}>
      <div className={'tool-btn'}><FaUndo/></div>
      <div className={'tool-btn'} onClick={()=> {setActiveTool('pencil')}}><FaPencilAlt/></div>
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

      <div className={'tool-btn'} onClick={()=> {setActiveTool('eraser')}}><FaEraser/></div>
      <div className={'tool-btn'} onClick={()=> {setActiveTool('pointer')}}><FaMousePointer/></div>
      <div className={'tool-btn'} onClick={()=> {timerClicked()}}><FaClock/></div>

      <Switch labelOne="" labelTwo="" valueOne={true} valueTwo={false}
              onChange={(value) => {
                setStudentAllowedToDraw(value);
              }}/>

      <div className={'tool-btn'}><FaSyncAlt/></div>

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