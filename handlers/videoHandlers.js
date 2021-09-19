// TODO potentially remove connections and use socket ids from other stuff
let connections = {};
let startedCalls = {};

module.exports = (io, socket) => {

  const addToVideo = ({login}) => {
    connections[login] = socket.id;
    io.to(socket.id).emit("added", {callStarted: startedCalls[login]});
  }

  const callTeacher = ({teacherLogin, studentLogin, signalData}) => {
    startedCalls[studentLogin] = true;

    const teacherSocketId = connections[teacherLogin];
    io.to(teacherSocketId).emit("student-calling", {studentLogin, signal: signalData});
  }

  const callAccepted = ({teacherLogin, studentLogin, signal}) => {
    startedCalls[teacherLogin] = true;

    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-accepted-call", {teacherLogin, signal})
  }


  const studentSendSignal = ({teacherLogin, stream}) => {
    const teacherSocketId = connections[teacherLogin];
    io.to(teacherSocketId).emit("student-signals", {stream})
  }

  const teacherSendSignal = ({studentLogin, stream}) => {
    const studentSocketId = connections[studentLogin];
    io.to(studentSocketId).emit("teacher-signals", {stream})
  }

  const disconnect = async ({caller}) => {
    const callerSocketId = connections[caller];

    io.to(callerSocketId).emit("caller-ended-call");
    for (const [key, value] of Object.entries(connections)) {
      if(value === socket.id){
        delete startedCalls[key]
      }
    }
  }

  socket.on('call-ended', disconnect)

  socket.on('add-to-video', addToVideo);

  socket.on('call-teacher', callTeacher);
  socket.on('call-accepted', callAccepted);

  socket.on('student-send-signal', studentSendSignal);

  socket.on('teacher-send-signal', teacherSendSignal);
}
