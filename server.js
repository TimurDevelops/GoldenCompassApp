const express = require('express');
const https = require('https')
const http = require('http')
const cors = require('cors');
const fs = require('fs');
const ws = require('ws');

const connectDB = require("./config/db");
const userHandlers = require('./handlers/userHandlers')
const canvasHandlers = require('./handlers/canvasHandlers')
const videoHandlers = require('./handlers/videoHandlers')
const chessboardHandlers = require('./handlers/chessboardHandlers')

const {env} = require('./config.json');
const credentials = {};

if (env === 'prod'){
  const privateKey = fs.readFileSync('./sslcert/golden-compass-app.key', 'utf8');
  const certificate = fs.readFileSync('./sslcert/golden-compass-app_com_chain.crt', 'utf8');
  credentials.key = privateKey;
  credentials.cert = certificate;
}

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
app.use('/api/errors', require('./routes/api/errors'));

app.get('/ping', (req, res) => {
  res.send(`Pong`);
});

const listener = env === 'prod' ? https.createServer(credentials, app) : http.createServer(app)

const server = listener.listen(Number(PORT), () => {
  console.log(`Sever started on port ${PORT}`);
});

const io = require('socket.io')(server, {
  wsEngine: ws.Server,
  cors: {
    origin: '*'
  }
})


io.sockets.on('connection', (socket) => {


  userHandlers(io, socket);

  canvasHandlers(io, socket);

  videoHandlers(io, socket)

  chessboardHandlers(io, socket)

})
