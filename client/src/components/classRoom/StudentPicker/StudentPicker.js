import React from "react";
import PropTypes from "prop-types";
import StudentItem from "./StudentItem";

import './StudentPicker.scss'

const StudentPicker = ({students, setAllowedStudent, open, setOpen, buttonVisible, allowedStudent}) => {
  return (
    <div className={`student-picker ${open ? 'open' : ''} ${buttonVisible ? '' : 'hidden'}`}>
      <div className={'picker-area'}>
        <div className={'bg'} onClick={() => setOpen(false)}/>

        <div className={'students'}>
          {students.map(student => <StudentItem key={student.id} setAllowedStudent={setAllowedStudent}
                                                student={student} allowedStudent={allowedStudent}/>)}
        </div>

        <div className={'menu-bg'}/>
      </div>

      <div className={`button-holder`}>
        <div className={'button'} onClick={() => setOpen(!open)}>Ученики</div>
      </div>
    </div>
  )
}

StudentPicker.propTypes = {
  students: PropTypes.array.isRequired,
  setAllowedStudent: PropTypes.array.isRequired,
  allowedStudent: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  buttonVisible: PropTypes.bool.isRequired,
}

export default StudentPicker;





