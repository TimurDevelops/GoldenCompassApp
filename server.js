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
  getRoomUsers,
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

// TODO make urls be from config
const server = app.listen(PORT, 'localhost', () => {
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
    if (usertype === 'student') {
      const userData = await getStudent(userLogin);
      const teacherData = await getTeacher(teacherLogin);
      const user = await userJoin(socket.id, userData, teacherLogin);

      if (!checkTeacherPresent(teacherLogin)) {
        io.to(user.socketId).emit('teacherNotPresent', {name: teacherData.name});
      } else if (!checkStudentAllowed(teacherLogin, userLogin)) {
        io.to(user.socketId).emit('studentDisallowed');
      } else {
        io.to(user.socketId).emit('studentAllowed');
        userJoin(socket.id, user, teacherLogin);
        socket.join(teacherLogin);
      }

      //  TODO запросить разрешение на доступ для ученика
      //  TODO Выводить обработку при запрещении входа

      if (!disallowRequestFromStudent[userLogin]) {
        const teacherSocketId = getSocketIdByLogin(teacherLogin);
        io.to(teacherSocketId).emit('studentRequestsEntrance', userLogin);
      }
      disallowRequestFromStudent[userLogin] = true;
      setTimeout(() => disallowRequestFromStudent[userLogin] = false, 30 * 1000);

      //  TODO Обработка сообщения о попытке входа ученика
    } else if (usertype === 'teacher') {
      const user = await getTeacher(userLogin);
      userJoin(socket.id, user, teacherLogin);
      socket.join(teacherLogin);
    }
  })

  socket.on('mouseDragged', ({teacher, data}) => {
    if (teacher) {
      io.to(teacher).emit('mouseDragged', data);
    }
  })

  socket.on('allowStudent', (teacherLogin, studentLogin) => {
    if (teacherLogin) {
      allowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      io.to(studentSocketId).emit('studentAllowed');


      //  TODO Обработка разрешения по id
    }
  })

  socket.on('disallowStudent', (teacherLogin, studentLogin) => {
    if (teacherLogin) {
      disallowStudentToClass(teacherLogin, studentLogin);
      const studentSocketId = getSocketIdByLogin(studentLogin);
      io.to(studentSocketId).emit('studentDisallowed');

      //  TODO Обработка разрешения по id
    }
  })


  socket.on('disconnect', () => {
    const user = getCurrentUser(socket.id);
    console.log("user = ", user)
    if (user.user.type === 'teacher') {
      user.allowedStudents.forEach(studentLogin => {
        const studentSocketId = getSocketIdByLogin(studentLogin);
        io.to(studentSocketId).emit('teacherNotPresent');
      })
      //  TODO Обработка отсоединения учителя

    }
    if (user.user.type === 'student') {
      const teacherSocketId = getSocketIdByLogin(user.room);
      io.to(teacherSocketId).emit('studentDisconnected');

      //  TODO Обработка отсоединения учителя
    }
    userLeave(user.socketId)
  })
})
