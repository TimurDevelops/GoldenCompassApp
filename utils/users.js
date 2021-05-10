const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const connections = [];

const getTeacher = async (login) => {
  const res = await Teacher.findOne({login: login});
  console.log(res)
  return res;
}

const getStudent = async (login) => {
  const res = await Student.findOne({login: login});
  console.log(res)
  return res;
}

const userJoin = (id, user, room) => {
  const userObject = {socketId: id, user, room};

  if(user.type === 'teacher'){
    user.allowedStudents = [];
  }

  connections.push(userObject);

  return userObject;
}

const getCurrentUser = id => {
  return connections.find((user) => user.id === id);
}

const getSocketIdByLogin = login => {
  const user = connections.find(i => i.user.login === login);
  return user.socketId;
}

const getRoomUsers = room => {
  return connections.filter(user => user.room === room)
}

const checkTeacherPresent = (teacherLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  return !!teacher;
}

const checkStudentAllowed = (teacherLogin, studentLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  return studentLogin in teacher.allowedStudents;
}

const allowStudentToClass = (teacherLogin, studentLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  teacher.allowedStudents.push(studentLogin);
}

const disallowStudentToClass = (teacherLogin, studentLogin) => {
  const teacher = connections.find(i => i.user.login === teacherLogin);
  teacher.allowedStudents.splice(teacher.allowedStudents.indexOf(studentLogin), 1)
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
  getRoomUsers,
  checkTeacherPresent,
  checkStudentAllowed,
  allowStudentToClass,
  disallowStudentToClass,
  userLeave
}