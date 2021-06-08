import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import './TeachersList.scss'
import TeacherItem from "./TeacherItem";
import axios from "axios";


const TeachersList = ({student: {login}}) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const getTeachers = async () => {
      const res = await axios.post('http://161.35.232.115:5000/api/student/get-teachers', {studentLogin: login});
      setTeachers(res.data.teachers);
    }
    getTeachers().catch((err)=> console.error(err))

  }, [login]);

  return (
    <div>
      Список учителей
      {teachers.map(teacher => <TeacherItem key={teacher._id} teacher={teacher}/>)}
    </div>
  )
}

TeachersList.propTypes = {
  student: PropTypes.object.isRequired
};

export default TeachersList;