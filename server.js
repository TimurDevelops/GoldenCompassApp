const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Init Middleware
app.use(express.json())

app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send(`API running`);
});

app.get('/ping', (req, res) => {
  res.send(`Pong`);
});

app.use('/login', (req, res) => {
  console.log(req.body)
  res.send({
    token: 'test1234'
  });
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

  socket.on('mouseDragged', (data) => {
    socket.broadcast.emit('mouseDragged', data);
  })
})


