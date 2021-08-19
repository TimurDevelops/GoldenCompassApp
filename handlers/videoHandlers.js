let connections = {};

module.exports = (io, socket) => {

  const addToVideo = ({login}) => {
    connections[login] = socket.id;
  }

  const callTeacher = ({teacherLogin, studentLogin, signalData}) => {
    const teacherSocketId = connections[teacherLogin];
    io.to(teacherSocketId).emit("student-calling", {studentLogin, signal: signalData});
  }

  const callAccepted = ({studentLogin, signal}) => {
    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-accepted-call", {signal})
  }


  const studentSendSignal = ({teacherLogin, stream}) => {
    const teacherSocketId = connections[teacherLogin];
    io.to(teacherSocketId).emit("student-signals", {stream})
  }

  const teacherSendSignal = ({studentLogin, stream}) => {
    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-signals", {stream})
  }


  socket.on('add-to-video', addToVideo);

  socket.on('call-teacher', callTeacher);
  socket.on('call-accepted', callAccepted);

  socket.on('student-send-signal', studentSendSignal);

  socket.on('teacher-send-signal', teacherSendSignal);
}
