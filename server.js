const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const canvasHandlers = require('./handlers/canvasHandlers')
const userHandlers = require('./handlers/userHandlers')


const app = express();
const PORT = process.env.PORT || 5000;
const {
  getTeacher,
  getStudent,
  userJoin,
  getCurrentUser,
  getSocketIdByLogin,
  // getRoomUsers,
  checkTeacherPresent,
  checkStudentAllowed,
  allowStudentToClass,
  disallowStudentToClass,
  getAllowedStudents,
  userLeave
} = require('./utils/users');


connectDB();

// Init Middleware
app.use(express.json())

app.use(cors());

// Define Routes
app.use('/api/level', require('./routes/api/levels'));
app.use('/api/student', require('./routes/api/students'));
app.use('/api/teacher', require('./routes/api/teacher'));
app.use('/api/auth', require('./routes/api/auth'));

app.get('/ping', (req, res) => {
  res.send(`Pong`);
});


const server = app.listen(PORT, () => {
  console.log(`Sever started on port ${PORT}`);
});


const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})


io.sockets.on('connection', (socket) => {

  userHandlers(io, socket);

  canvasHandlers(io, socket);

  socket.on('disconnect', async () => {
    const user = getCurrentUser(socket.id);
    if (user === undefined) {
      return
    }
    userLeave(user.socketId)
  })
})
