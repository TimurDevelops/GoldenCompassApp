import React, {useState} from 'react';
import PropTypes from "prop-types";
import {FaPencilAlt, FaEraser, FaSyncAlt, FaMousePointer, FaClock, FaMinusCircle} from 'react-icons/fa';

import {Interval} from "../../../../utils/interval";
import Switch from "../../../ui/Switch";
import {TOOLS} from "../../../../utils/types";
import {useUser} from "../../../../hooks/useUser";
import {useSocket} from "../../../../hooks/useSocket";
import InlinePicker from "../../../ui/InlinePicker";
import InlineColorPicker from "../../../ui/InlineColorPicker";


const ToolPanel = ({setActiveTool, defWidth, setDrawWidth, defColor, setDrawColor}) => {

  const {socket} = useSocket();

  const {user: {type: usertype, login}} = useUser();

  const displayTeacherTools = usertype === 'teacher';


  const [timerRunning, setTimerRunning] = useState(false);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const resetTimer = () => {
    setSecond(0);
    setMinute(0);
    setTimerRunning(false);
  }

  const setStudentAllowedToDraw = (isEnabled) => {
    socket.emit("set-drawing-enabled", {login, isEnabled});
  }

  const resetStudentCanvas = () => {
    socket.emit("reset-canvas", {teacherLogin: login});
  }

  Interval(() => {
    if (second < 59) {
      setSecond(second + 1);
    } else {
      setSecond(0);
      setMinute(minute + 1);
    }
  }, timerRunning ? 1000 : null)

  return (

    <div className={"tool-panel"}>
      <InlinePicker
        defaultValue={defWidth}
        valueField={'value'}
        labelField={'label'}
        values={[
          {label: '2px', value: 2},
          {label: '5px', value: 5},
          {label: '8px', value: 8},
        ]}
        onChangeComplete={
          width => {
            setDrawWidth(width)
          }
        }
      />

      <div className={'tool-panel-divider'}/>
      <InlineColorPicker
        color={defColor}
        onChangeComplete={
          color => {
            setDrawColor(color);
          }
        }
      />

      <div className={'tool-panel-divider'}/>

      <div className={'tools-buttons'}>
      <div className={'tool-btn salad'} onClick={() => {
        setActiveTool(TOOLS.PENCIL)
      }}><FaPencilAlt/></div>

      <div className={'tool-btn salad'} onClick={() => {
        setActiveTool(TOOLS.ERASER)
      }}><FaEraser/></div>

      {displayTeacherTools && <div className={'tool-btn salad'} onClick={() => {
        setActiveTool(TOOLS.CURSOR)
      }}><FaMousePointer/></div>}

      {displayTeacherTools && <div className={'tool-btn green'} onClick={() => {
        setTimerRunning(!timerRunning);
      }}><FaClock/></div>}

      {displayTeacherTools &&
      <div className={'time-holder'}>
        <span className={'minute'}>{minute < 10 ? '0' + minute : minute}</span>
        <span className={'colon'}>:</span>
        <span className={'seconds'}>{second < 10 ? '0' + second : second}</span>
      </div>}
      {displayTeacherTools && <div className={'tool-btn red'} onClick={() => {
        resetTimer();
      }}><FaMinusCircle/></div>
        }

      {displayTeacherTools && <Switch labelOne="" labelTwo="" valueOne={true} valueTwo={false}
                                      onChange={(value) => setStudentAllowedToDraw(value)}/>}

      {displayTeacherTools && <div className={'tool-btn salad'} onClick={() => resetStudentCanvas()}><FaSyncAlt/></div>}

      </div>
    </div>
  )
}

ToolPanel.propTypes = {
  setActiveTool: PropTypes.func.isRequired,
  defWidth: PropTypes.number.isRequired,
  setDrawWidth: PropTypes.func.isRequired,
  defColor: PropTypes.string.isRequired,
  setDrawColor: PropTypes.func.isRequired,
}

export default ToolPanel;