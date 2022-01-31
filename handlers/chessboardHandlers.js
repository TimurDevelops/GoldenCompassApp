const {
  getSocketIdByLogin,
  getAllowedStudents,
} = require("../utils/users");

const disallowRequestFromStudent = {}


module.exports = (io, socket) => {

  const makeMove = async ({room, from, to}) => {
    if (room) {
      const teacherSocketId = getSocketIdByLogin(room);
      io.to(teacherSocketId).emit('move-made', {from, to});

      const allowedStudents = getAllowedStudents(room);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('move-made', {from, to});
        }
      }

    }
  }

  socket.on('chess-make-move', makeMove)
}
