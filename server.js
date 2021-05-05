const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

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

io.sockets.on('connection', (socket) => {
  // Todo Change socket id on join??

  socket.on('joinClassRoom', ({teacherLogin, usertype}) => {
    if (usertype === 'student') {
      //  TODO запросить разрешение на доступ для ученика
      //  TODO Выводить обработку при запрещении входа
      //  TODO Сообщение о попытке входа в комнату от ученика в комнату учителя по id
      //  TODO Обработка сообщения о попытке входа ученика
    } else if(usertype === 'teacher'){
      socket.join(teacherLogin)
    }
  })

  socket.on('mouseDragged', (teacherLogin, data) => {
    if(teacherLogin){
      io.to(teacherLogin).emit('mouseDragged', data);
    }
  })

  socket.on('allowStudent', (teacherLogin, studentLogin) => {
    if(teacherLogin){
      io.to(teacherLogin).emit('studentAllowed', studentLogin);
      //  TODO Обработка разрешения по id
      //  TODO добавление ученика в список допущеных до учителя
    }
  })
})
