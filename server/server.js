require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const {TwitchInfo} = require('./middleware');
const server = http.createServer(app);
const serverPort = 3000;
const cors = require('cors');

const { Server } = require("socket.io");//https://adamtheautomator.com/https-nodejs/ may be required for extension
const io = new Server(server);
app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api', TwitchInfo, (req, res) => {
  res.send(req.twitch ? req.twitch.display_name : 'Anonymous');
});

server.listen(serverPort, () => {
  console.log(`Server hosted on port:${serverPort}`);
});

io.on('connection', (socket) => {
  console.log('Someone connected. Sending initializer info');
  let supportedEvents = [
    {
      id: '1',
      name: 'Helmet',
      max: 5
    },
    {
      id: '2',
      name: 'Weapon',
      max: 5
    },
    {
      id: '3',
      name: 'Helmet',
      max: 5
    }
  ]
  socket.emit('initializer', supportedEvents);
  socket.on('player', (arg) => {
    console.log(arg);
  });
  socket.on('message', (arg) => {
    console.log(arg);
  })
});