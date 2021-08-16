const {
  getStudent,
  getTeacher,
  userJoin,
  checkTeacherPresent,
  checkStudentAllowed,
  getSocketIdByLogin
} = require("../utils/users");
const {disallowStudentToClass, allowStudentToClass} = require("./utils/users");

const disallowRequestFromStudent = {}

module.exports = (io, socket) => {

  const teacherJoin = async ({login, room}) => {
    const user = await getTeacher(login);
    const userObject = userJoin(socket.id, user, room);
    socket.join(room);
    io.to(socket.id).emit('joinedClassRoom', {user: userObject});
  }

  const studentJoin = async ({login, room}) => {
    const userData = await getStudent(login);
    const teacherData = await getTeacher(room);
    const user = userJoin(socket.id, userData, room);

    if (!checkTeacherPresent(room)) {
      io.to(user.socketId).emit('teacherNotPresent', {name: teacherData.name});
    } else if (!checkStudentAllowed(room, login)) {
      io.to(user.socketId).emit('studentDisallowed', {name: teacherData.name});

      if (!disallowRequestFromStudent[login]) {
        const teacherSocketId = getSocketIdByLogin(room);
        io.to(teacherSocketId).emit('studentRequestsEntrance', {name: userData.name});
        setTimeout(() => disallowRequestFromStudent[login] = false, 30 * 1000);
      }
      disallowRequestFromStudent[login] = true;

    } else {
      socket.join(login);
      io.to(user.socketId).emit('joinedClassRoom', {user});
    }
  }

  const disallowStudent = (teacherLogin, studentLogin) => {
    if (teacherLogin) {
      disallowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      io.to(studentSocketId).emit('studentDisallowed');
    }
  }

  const allowStudent = async ({teacherLogin, studentLogin}) => {
    if (teacherLogin) {
      allowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      const teacherSocketId = getSocketIdByLogin(teacherLogin);

      if (studentSocketId) {
        io.to(studentSocketId).emit('allowedToClassRoom');
      }

      if (teacherSocketId) {
        io.to(teacherSocketId).emit('studentAllowed', {login: studentLogin});
      }

    }
  }

  socket.on('join:teacher', teacherJoin);
  socket.on('join:student', studentJoin);

  socket.on('student:allow', allowStudent);
  socket.on('student:disallow', disallowStudent);

}
