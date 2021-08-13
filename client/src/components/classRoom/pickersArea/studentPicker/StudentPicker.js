import React from "react";
import PropTypes from "prop-types";
import StudentItem from "./StudentItem";

const StudentPicker = ({open, setOpen, students, setAllowedStudent, allowedStudent}) => {

  return (
    <div className={`item-picker student-picker ${open ? 'open' : ''}`}>
      <div className={'picker-area'}>
        <div className={'picker-menu-bg'} onClick={() => setOpen(false)}/>

        <div className={'picker-items students'}>
          {students.map(student => <StudentItem key={student._id} setAllowedStudent={setAllowedStudent}
                                                student={student} allowedStudent={allowedStudent}/>)}
        </div>

      </div>

    </div>
  )
}

StudentPicker.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  students: PropTypes.array.isRequired,
  setAllowedStudent: PropTypes.func.isRequired,
  allowedStudent: PropTypes.string,
}

export default StudentPicker;





