const {getSocketIdByLogin} = require("../utils/users");

module.exports = (io, socket) => {

  const callUser = ({ teacherLogin, signalData, from, name }) => {
    console.log(teacherLogin)
    const teacherSocketId = getSocketIdByLogin(teacherLogin);
    io.to(teacherSocketId).emit("call-user", { signal: signalData, from, name });
  }

  const callAccepted = ({to: studentLogin, signal}) => {
    const studentSocketId = getSocketIdByLogin(studentLogin);
    io.to(studentSocketId).emit("call-accepted", signal)
  }

  socket.on('call-user', callUser);
  socket.on('call-accepted', callAccepted);

}
