const {getAllowedStudents, getSocketIdByLogin} = require("../utils/users");

module.exports = (io, socket) => {

  const pencil = ({room, data}) => {
    if (room) {
      io.to(room).emit('draw', data);
    }
  }

  const eraser = ({room, data}) => {
    if (room) {
      io.to(room).emit('erase', data);
    }
  }

  const cursor = ({room, data}) => {
    if (room) {
      io.to(room).emit('cursor', data);
    }
  }

  const setDrawingEnabled = async ({login, isEnabled}) => {
    if (login) {
      const allowedStudents = getAllowedStudents(login);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('drawing-enabled-set', {isEnabled});
        }
      }
    }
  }

  const resetCanvas = async ({teacherLogin}) => {
    if (teacherLogin) {
      socket.broadcast.to(teacherLogin).emit('canvas-reset');
    }
  }

  const changeSlide = async ({teacherLogin, slide}) => {

    if (teacherLogin) {
      const allowedStudents = getAllowedStudents(teacherLogin);
      const teacherSocketId = getSocketIdByLogin(teacherLogin);
      if (teacherSocketId) {
        io.to(teacherSocketId).emit('canvas-slide-picked', {slide});
      }

      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('canvas-slide-changed', {slide});
        }
      }
    }
  }


  socket.on('canvas-pencil', pencil);
  socket.on('canvas-eraser', eraser);
  socket.on('canvas-cursor', cursor);

  socket.on('set-drawing-enabled', setDrawingEnabled);
  socket.on('reset-canvas', resetCanvas);
  socket.on('canvas-change-slide', changeSlide);

}