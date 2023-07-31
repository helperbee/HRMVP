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
const io = new Server(server, {cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});
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

//this could be done through a database but meh
let supportedEvents = [
  {
    id: 1,
    name: 'Helmet',
    quantity: 3,
    image: 'https://d3planner-assets.maxroll.gg/lost-ark/webp/if_item_01_180.webp'
  },
  {
    id: 2,
    name: 'Pauldron',
    quantity: 3,      
    image: 'https://d3planner-assets.maxroll.gg/lost-ark/webp/if_item_01_181.webp'
  },
  {
    id: 3,
    name: 'Armor',
    quantity: 3,      
    image: 'https://d3planner-assets.maxroll.gg/lost-ark/webp/if_item_01_183.webp'
  }]
io.on('connection', (socket) => {
  console.log('Someone connected. Sending initializer info');
  socket.on('supported', (arg) => {
    socket.emit('initializer', supportedEvents.filter((e) => e.quantity > 0));
  });
  socket.on('whoami', (obj) => {
    console.log('Defining workers sessionId : ', obj);
    workerId = socket.id;
  });
  socket.on('actions', (arg) => {
    //response from worker
    //potentially add confetti on successful hone? https://www.npmjs.com/package/react-confetti
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
          supportedEvents[sending.id - 1].quantity--;
          if(supportedEvents[sending.id - 1].quantity <= 0){
            //resend the supported list back to the connected clients.
            let bonus = supportedEvents.every(s => s.quantity === 0 && s.name !== 'Gem');//To prevent forever gem attempting. 1 & done
            if(bonus){
              supportedEvents.push({              
                
                  id: 4,
                  name: 'Gem',
                  quantity: 1,      
                  image: 'https://cdn.discordapp.com/attachments/246777011572310016/1135294259864547350/use_9_55.png'
                
              });
            }
            io.emit('initializer', supportedEvents.filter((e) => e.quantity > 0));
          }
        }catch{
          console.log('Error relaying to worker.');
        }
      }
    });
    
  })
});