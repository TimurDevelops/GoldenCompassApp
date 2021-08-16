const {getAllowedStudents, getSocketIdByLogin} = require("./utils/users");
module.exports = (io, socket) => {

  const pencil = ({teacher, data}) => {
    if (teacher) {
      io.to(teacher).emit('serverPencilDraw', data);
    }
  }

  const eraser = ({teacher, data}) => {
    if (teacher) {
      io.to(teacher).emit('serverEraser', data);
    }
  }

  const cursor = ({teacher, data}) => {
    if (teacher) {
      io.to(teacher).emit('serverCursor', data);
    }
  }

  const setDrawingEnabled = async ({login, isEnabled}) => {
    if (login) {
      const allowedStudents = getAllowedStudents(login);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('allowToDraw', {isEnabled});
        }
      }
    }
  }

  const resetCanvas = async ({teacherLogin}) => {
    if (teacherLogin) {
      const allowedStudents = getAllowedStudents(teacherLogin);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('resetCanvas');
        }
      }
    }
  }

  const changeSlide = async ({teacherLogin, slideImg}) => {

    if (teacherLogin) {
      const allowedStudents = getAllowedStudents(teacherLogin);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('slideChanged', {slideImg});
        }
      }
    }
  }



  socket.on('canvas:pencil', pencil);
  socket.on('canvas:eraser', eraser);
  socket.on('canvas:cursor', cursor);

  socket.on('canvas:set-drawing-enabled', setDrawingEnabled);
  socket.on('canvas:reset-canvas', resetCanvas);
  socket.on('canvas:change-slide', resetCanvas);

}
