require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();

const cors = require('cors');
app.use(cors());
const http = require('http');
const {TwitchInfo} = require('./middleware');
const server = http.createServer(app);
const serverPort = 3000;

const { Server } = require("socket.io");//https://adamtheautomator.com/https-nodejs/ may be required for extension
const io = new Server(server);
let workerId = undefined;

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api', TwitchInfo, (req, res) => {
  res.send(req.twitch ? req.twitch.display_name : 'Anonymous');
});


server.listen(serverPort, () => {
  console.log(`Server hosted on port:${serverPort}`);
});

// io.use((socket, next) => {
//   console.log("Headers from the client:", socket);
//   next();
// });

io.on('connection', (socket) => {
  console.log('Someone connected. Sending initializer info');
  let supportedEvents = [
    {
      id: 1,
      name: 'Helmet',
      max: 5
    },
    {
      id: 2,
      name: 'Pauldron',
      max: 5
    }
  ]
  socket.emit('feature', {id:1, message:'hello'});
  socket.on('supported', (arg) => {
    socket.emit('initializer', supportedEvents);
  });
  socket.on('whoami', (obj) => {
    console.log('Defining workers sessionId : ', obj);
    workerId = socket.id;
  });
  socket.on('player', (arg) => {
    console.log(arg);
  });
  socket.on('actions', (arg) => {
    console.log(arg);
  });
  socket.on('message', (arg) => {
    TwitchInfo(arg, (e, updated) => {      
      if(e){
        console.log(e);
      }else{
        arg = updated;
      }
      if(workerId){
        try{
          let { twitchSession, ...sending } = updated || arg; // less clutter
          io.to(workerId).emit('message', sending);
        }catch{
          console.log('Error relaying to worker.');
        }
      }
    });
    
  })
});