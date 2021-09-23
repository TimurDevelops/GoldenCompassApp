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
      io.to(teacherLogin).emit('canvas-reset');
    }
  }

  const changeSlide = async ({teacherLogin, slide}) => {
    if (teacherLogin) {
      const teacherSocketId = getSocketIdByLogin(teacherLogin);
      io.to(teacherSocketId).emit('canvas-slide-picked', {slide});
      io.to(teacherSocketId).emit('canvas-slide-changed', {slide});

      const allowedStudents = getAllowedStudents(teacherLogin);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('canvas-slide-changed', {slide});
        }
      }

    }
  }

  const imageLoaded = async ({login}) => {
    const userSocketId = getSocketIdByLogin(login);
    io.to(userSocketId).emit('loaded-image');
  }

  const changeAbacus = async ({room, section, state}) => {
    if (room) {
      const teacherSocketId = getSocketIdByLogin(room);
      io.to(teacherSocketId).emit('change-abacus', {section, state});

      const allowedStudents = getAllowedStudents(room);
      for (const studentLogin of allowedStudents) {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        if (studentSocketId) {
          io.to(studentSocketId).emit('change-abacus', {section, state});
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
  socket.on('image-loaded', imageLoaded);

  socket.on('abacus-clicked', changeAbacus);

}
