const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
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
  userLeave
} = require('./utils/users');


connectDB();

// Init Middleware
app.use(express.json())

app.use(cors());

// Define Routes
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

const disallowRequestFromStudent = {}

io.sockets.on('connection', (socket) => {

  socket.on('joinClassRoom', async ({login: userLogin, teacher: teacherLogin, usertype}) => {
    console.log('joinClassRoom')

    if (usertype === 'student') {
      const userData = await getStudent(userLogin);
      const teacherData = await getTeacher(teacherLogin);
      const user = await userJoin(socket.id, userData, teacherLogin);

      console.log(checkStudentAllowed(teacherLogin, userLogin))

      if (!checkTeacherPresent(teacherLogin)) {
        io.to(user.socketId).emit('teacherNotPresent', {name: teacherData.name});
      } else if (!checkStudentAllowed(teacherLogin, userLogin)) {
        io.to(user.socketId).emit('studentDisallowed', {name: teacherData.name});

        if (!disallowRequestFromStudent[userLogin]) {
          const teacherSocketId = getSocketIdByLogin(teacherLogin);
          io.to(teacherSocketId).emit('studentRequestsEntrance', {name: userData.name});
        }
        disallowRequestFromStudent[userLogin] = true;
        setTimeout(() => disallowRequestFromStudent[userLogin] = false, 30 * 1000);

      } else {
        socket.join(teacherLogin);
        io.to(user.socketId).emit('joinedClassRoom');
      }

    } else if (usertype === 'teacher') {
      const user = await getTeacher(userLogin);
      userJoin(socket.id, user, teacherLogin);
      socket.join(teacherLogin);
      io.to(socket.id).emit('joinedClassRoom');
    }
  })

  socket.on('clientPencilDraw', ({teacher, data}) => {
    if (teacher) {
      io.to(teacher).emit('serverPencilDraw', data);
    }
  })

  socket.on('clientEraser', ({teacher, data}) => {
    if (teacher) {
      io.to(teacher).emit('serverEraser', data);
    }
  })

  socket.on('allowStudent', async ({teacherLogin, studentLogin}) => {

    if (teacherLogin) {
      allowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);

      if (studentSocketId) {
        io.to(studentSocketId).emit('studentAllowed');
      }
    }
  })

  socket.on('disallowStudent', (teacherLogin, studentLogin) => {

    if (teacherLogin) {
      disallowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      io.to(studentSocketId).emit('studentDisallowed');
    }
  })


  socket.on('disconnect', async () => {
    const user = getCurrentUser(socket.id);
    if (user === undefined) {
      return
    }
    if (user.user.type === 'teacher') {
      const teacherData = await getTeacher(user.user.login);
      user.allowedStudents.forEach(studentLogin => {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        io.to(studentSocketId).emit('teacherNotPresent', {name: teacherData.name});
      })
      //  TODO Обработка отсоединения учителя

    }
    if (user.user.type === 'student') {
      const teacherSocketId = getSocketIdByLogin(user.room);
      if (teacherSocketId) {
        io.to(teacherSocketId).emit('studentDisconnected');
      }

      //  TODO Обработка отсоединения ученика
    }
    userLeave(user.socketId)
  })
})
