const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const serverPort = 3000;

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api', (req, res) => {
  res.send('Hello.');
});

server.listen(serverPort, () => {
  console.log(`Server hosted on port:${serverPort}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('player', (arg) => {
    console.log(arg);
  });
});