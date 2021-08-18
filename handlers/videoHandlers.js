
let connections = {};

module.exports = (io, socket) => {

  const addToVideo = ({login}) => {
    connections[login] = socket.id;
  }

  const callTeacher = ({ teacherLogin, studentLogin }) => {
    const teacherSocketId = connections[teacherLogin];
     io.to(teacherSocketId).emit("student-calling", { studentLogin });
  }

  const callAccepted = ({studentLogin}) => {
    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-accepted-call")
  }


  const studentSendSignal = ({teacherLogin, stream}) => {
    const teacherSocketId = connections[teacherLogin];
    io.to(teacherSocketId).emit("student-sends-signal", {stream})
  }

  const teacherAcceptedSignal = ({studentLogin}) => {
    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-accepted-signal")
  }


  const teacherSendSignal = ({studentLogin, stream}) => {
    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-sends-signal", {stream})
  }

  const studentAcceptedSignal = ({teacherLogin}) => {
    const teacherSocketId = connections[teacherLogin];
    io.to(teacherSocketId).emit("student-accepted-signal")
  }


  socket.on('add-to-video', addToVideo);

  socket.on('call-teacher', callTeacher);
  socket.on('call-accepted', callAccepted);

  socket.on('student-send-signal', studentSendSignal);
  socket.on('teacher-accepted-signal', teacherAcceptedSignal);

  socket.on('teacher-send-signal', teacherSendSignal);
  socket.on('student-accepted-signal', studentAcceptedSignal);
}
