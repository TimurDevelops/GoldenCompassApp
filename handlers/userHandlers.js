const {
  getStudent,
  getTeacher,
  userJoin,
  checkTeacherPresent,
  checkStudentAllowed,
  getSocketIdByLogin,
  getCurrentUser,
  userLeave, getAllowedStudents,
} = require("../utils/users");
const {disallowStudentToClass, allowStudentToClass} = require("../utils/users");

const disallowRequestFromStudent = {}


module.exports = (io, socket) => {

  const teacherJoin = async ({room, login}) => {
    const user = await getTeacher(login);
    const userObject = userJoin(socket.id, user, room);

    io.to(socket.id).emit('teacher-joined', {user: userObject});

    socket.broadcast.to(room).emit('teacher-present', {login});

    socket.join(room);
  }

  const studentJoin = async ({room, login}) => {
    const userData = await getStudent(login);
    const teacherData = await getTeacher(room);
    const user = userJoin(socket.id, userData, room);

    socket.join(room);

    if (!checkTeacherPresent(room)) {
      io.to(user.socketId).emit('teacher-absent', {name: teacherData.name});
    } else if (!checkStudentAllowed(room, login)) {
      io.to(user.socketId).emit('student-disallowed', {name: teacherData.name});

      if (!disallowRequestFromStudent[login]) {
        const teacherSocketId = getSocketIdByLogin(room);
        io.to(teacherSocketId).emit('student-requests-entrance', {name: userData.name});
        setTimeout(() => disallowRequestFromStudent[login] = false, 30 * 1000);
      }
      disallowRequestFromStudent[login] = true;

    } else {
      io.to(user.socketId).emit('student-joined', {user});
    }
  }

  const disallowStudent = (teacherLogin, studentLogin) => {
    if (teacherLogin) {
      disallowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      io.to(studentSocketId).emit('student-disallowed');
    }
  }

  const allowStudent = async ({teacherLogin, studentLogin}) => {
    if (teacherLogin) {
      allowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      const teacherSocketId = getSocketIdByLogin(teacherLogin);

      if (studentSocketId) {
        io.to(studentSocketId).emit('student-allowed', {teacher: teacherLogin});
      }

      if (teacherSocketId) {
        io.to(teacherSocketId).emit('allowed-student-set', {login: studentLogin});
      }

    }
  }

  const disconnect = async () => {
    const user = getCurrentUser(socket.id);

    if(!user) return

    const allowedStudents = getAllowedStudents(user.login);

    for (const studentLogin of allowedStudents) {
      const studentSocketId = getSocketIdByLogin(studentLogin);
      if (studentSocketId) {
        io.to(user.socketId).emit('teacher-absent', {name: user.name});
      }
    }

    userLeave(user.socketId)
  }

  socket.on('disconnect', disconnect)

  socket.on('join-teacher', teacherJoin);
  socket.on('join-student', studentJoin);

  socket.on('student-allow', allowStudent);
  socket.on('student-disallow', disallowStudent);

}
