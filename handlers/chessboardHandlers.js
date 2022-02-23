const {
  getSocketIdByLogin,
  getAllowedStudents,
} = require("../utils/users");

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

  const startNewGame = async ({room, isPlayingAsWhite}) => {
    if (room) {
      const teacherSocketId = getSocketIdByLogin(room);
      io.to(teacherSocketId).emit('new-game-started', {isPlayingAsWhite});

      const allowedStudents = getAllowedStudents(room);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('new-game-started', {isPlayingAsWhite: !isPlayingAsWhite});
        }
      }

    }
  }

  const takeMoveBack = async ({room, previousMove}) => {
    if (room) {
      const teacherSocketId = getSocketIdByLogin(room);
      io.to(teacherSocketId).emit('move-taken-back', {previousMove});

      const allowedStudents = getAllowedStudents(room);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('move-taken-back', {previousMove});
        }
      }
    }
  }

  const switchSides = async ({room, isPlayingAsWhite: isWhite}) => {
    if (room) {
      const teacherSocketId = getSocketIdByLogin(room);
      io.to(teacherSocketId).emit('sides-switched', {isWhite});

      const allowedStudents = getAllowedStudents(room);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('sides-switched', {isWhite: !isWhite});
        }
      }
    }
  }

  socket.on('chess-make-move', makeMove)
  socket.on('start-new-game', startNewGame)
  socket.on('take-move-back', takeMoveBack)
  socket.on('switch-sides', switchSides)
}
