import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import './TeachersList.scss'
import TeacherItem from "./TeacherItem";
import api from "../../utils/api";


const TeachersList = ({student: {login}}) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const getTeachers = async () => {
      const res = await api.post('/student/get-teachers', {studentLogin: login});
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