const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const userHandlers = require('./handlers/userHandlers')
const canvasHandlers = require('./handlers/canvasHandlers')
const videoHandlers = require('./handlers/videoHandlers')

const app = express();
const PORT = process.env.PORT || 5000;

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

  videoHandlers(io, socket)

})
