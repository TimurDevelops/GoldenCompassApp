import React, {useState} from 'react';
import PropTypes from "prop-types";
import {FaPencilAlt, FaEraser, FaSyncAlt, FaMousePointer, FaClock, FaMinusCircle} from 'react-icons/fa';

import useInterval from "../../../utils/useInterval";
import Switch from "../../ui/Switch";
import {TOOLS} from "../../../utils/types";
import ColorPicker from "../../ui/ColorPicker";
import Picker from "../../ui/Picker";


const ToolPanel = ({
                     drawColor,
                     setActiveTool,
                     setDrawWidth,
                     setDrawColor,
                     setStudentAllowedToDraw,
                     displayTeacherTools
                   }) => {

  const [timerRunning, setTimerRunning] = useState(false);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const resetTimer = () => {
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
      <div className={'tool-btn salad'} onClick={() => {
        setActiveTool(TOOLS.PENCIL)
      }}><FaPencilAlt/></div>

      <div>
        <Picker
          defaultValue={10}
          valueField={'value'}
          labelField={'label'}
          values={[
            {label: '10px', value: 10},
            {label: '20px', value: 20},
            {label: '50px', value: 50},
            {label: '150px', value: 150}
          ]}
          onChangeComplete={
            width => {
              setDrawWidth(width)
            }
          }
        />
      </div>
      <div>
        <ColorPicker
          color={drawColor}
          onChangeComplete={
            color => {
              setDrawColor(color);
            }
          }
        />
      </div>

      <div className={'tool-btn '} onClick={() => {
        setActiveTool(TOOLS.ERASER)
      }}><FaEraser/></div>

      {displayTeacherTools && <div className={'tool-btn'} onClick={() => {
        setActiveTool(TOOLS.CURSOR)
      }}><FaMousePointer/></div>}

      {displayTeacherTools && <div className={'border'}>

        <div className={'tool-btn green'} onClick={() => {
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
      </div>}

      {displayTeacherTools && <Switch labelOne="" labelTwo="" valueOne={true} valueTwo={false}
                                      onChange={(value) => {
                                        console.log(value)
                                        setStudentAllowedToDraw(value);
                                      }}/>}

      {displayTeacherTools && <div className={'tool-btn'} onClick={() => {
        setSecond(second + 1)
      }}><FaSyncAlt/></div>}

    </div>
  )
}

ToolPanel.propTypes = {
  drawColor: PropTypes.string.isRequired,
  setActiveTool: PropTypes.func.isRequired,
  setStudentAllowedToDraw: PropTypes.func.isRequired,
  setDrawWidth: PropTypes.func.isRequired,
  setDrawColor: PropTypes.func.isRequired,
  displayTeacherTools: PropTypes.bool.isRequired
}

export default ToolPanel;