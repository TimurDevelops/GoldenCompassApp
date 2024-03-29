const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

let connections = [];

const getTeacher = async (login) => {
  const res = await Teacher.findOne({login: login});
  return {
    _id: res._id,
    name: res.name,
    login: res.login,
    type: 'teacher'
  };
}

const getStudent = async (login) => {
  const res = await Student.findOne({login: login});
  return {
    _id: res._id,
    name: res.name,
    login: res.login,
    type: 'student'
  };
}

const userJoin = (id, user, room) => {
  const userObject = {socketId: id, user, room};

  if (user.type === 'teacher') {
    userObject.allowedStudents = [];

    for (let i = 0; i < connections.length; i++) {
      if (connections[i].user.login === user.login) {
        userObject.allowedStudents = connections[i].allowedStudents
      }
    }
  }

  connections = connections.filter((i) => i.user.login !== user.login)

  connections.push(userObject);

  return userObject;
}

const getCurrentUser = id => {
  return connections.find((user) => {
    return user.socketId === id
  });
}

const getSocketIdByLogin = login => {
  const user = connections.find(i => i.user.login === login);
  if (user) {
    return user.socketId;
  } else {
    return null;
  }
}

// const getRoomUsers = room => {
//   return connections.filter(user => user.room === room)
// }

const checkTeacherPresent = (teacherLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  return !!teacher;
}

const checkStudentAllowed = (teacherLogin, studentLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  return teacher.allowedStudents.includes(studentLogin);
}

const allowStudentToClass = (teacherLogin, studentLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  teacher.allowedStudents.push(studentLogin);
}

const disallowStudentToClass = (teacherLogin, studentLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  teacher.allowedStudents.splice(teacher.allowedStudents.indexOf(studentLogin), 1)
}

const getAllowedStudents = (teacherLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  return teacher ? teacher.allowedStudents : '';
}

const userLeave = (id) => {
  const index = connections.findIndex(user => user.id === id);
  if (index !== -1) {
    return connections.splice(index, 1)[0];
  }
}

module.exports = {
  getTeacher,
  getStudent,
  userJoin,
  getCurrentUser,
  getSocketIdByLogin,
  // getRoomUsers,
  checkTeacherPresent,
  checkStudentAllowed,
  allowStudentToClass,
  disallowStudentToClass,
  getAllowedStudents,
  userLeave
}