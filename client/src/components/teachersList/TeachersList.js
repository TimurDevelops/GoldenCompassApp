import React, {useEffect, useState} from "react";

import TeacherItem from "./TeacherItem";
import GoBack from "../ui/GoBack";

import {useUser} from "../../hooks/useUser";

import api from "../../utils/api";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const {user} = useUser()

  useEffect(() => {
    const getTeachers = async () => {
      const res = await api.post('/student/get-teachers', {studentLogin: user.login});
      setTeachers(res.data.teachers);
    }
    getTeachers().catch((err) => console.error(err))

  }, [user]);

  return (
    <div className={"menu-bg"} id={'resetPassForm'}>
      <div className={"menu-wrapper"}>
        <div className="login-header">
          <p>{teachers.length ? 'Выберите учителя...' : 'Для вас не назначено ни одного учителя...'}</p>
        </div>

        {teachers.map(teacher => <TeacherItem key={teacher._id} teacher={teacher}/>)}

        <GoBack/>

      </div>
    </div>
  )
}

export default TeachersList;