import React, {useState} from "react";
import PropTypes from "prop-types";
import StudentItem from "./StudentItem";

import './StudentPicker.scss'

const StudentPicker = ({students, setAllowedStudent, open, setOpen, buttonVisible}) => {
  return (
    <div className={`student-picker ${open ? 'open' : ''}`}>
      <div className={'picker-area'}>
        <div className={'bg'} onClick={() => setOpen(false)}/>

        <div className={'students'}>
          {students.map(student => <StudentItem key={student.id} setAllowedStudent={setAllowedStudent}
                                                student={student}/>)}
        </div>
      </div>

      <div className={`button-holder ${buttonVisible ? '' : 'hidden'}`}>
        <div className={'button'} onClick={() => setOpen(!open)}>Ученики</div>
      </div>
    </div>
  )
}

StudentPicker.propTypes = {
  students: PropTypes.array.isRequired,
  setAllowedStudent: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  buttonVisible: PropTypes.bool.isRequired,
}

export default StudentPicker;





