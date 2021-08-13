import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

import TeacherItem from "./TeacherItem";
import GoBack from "../ui/GoBack";

import api from "../../utils/api";

const TeachersList = ({student: {login}}) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const getTeachers = async () => {
      const res = await api.post('/student/get-teachers', {studentLogin: login});
      setTeachers(res.data.teachers);
    }
    getTeachers().catch((err) => console.error(err))

  }, [login]);

  return (
    <div className={"menu-bg"} id={'resetPassForm'}>
      <div className={"menu-wrapper"}>
        <div className="login-header">
          <p>{teachers.length ? 'Выберите учителя...' : 'Для вас не назначено ни одного учителя...'}</p>
        </div>

        {teachers.map(teacher => <TeacherItem key={teacher._id} teacher={teacher}/>)}

        <GoBack/>

      </div>
    </div>)
}

TeachersList.propTypes = {
  student: PropTypes.object.isRequired
};

export default TeachersList;