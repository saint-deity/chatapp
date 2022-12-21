const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let usersConnected = 0;

let data = [];
<<<<<<< HEAD
let sockets = [];
=======
>>>>>>> d8adea7b781e5f63cd0b58265e76c63cecc8268f

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  app.use('/style.css', express.static(__dirname + '/style.css'));
  app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));
});

app.get('/data', function(req, res) {
  res.json(data);
});

app.post('/data', function(req, res) {
  console.log("post request received")

  let old = JSON.parse(req.body.data);
<<<<<<< HEAD
  let socketID = old.family_gathering;

  if (!socketID) {
    res.json(data);
    return;
  }

  for (let i = 0; i < sockets.length; i++) {
    if (sockets[i].id == socketID) {
      let lastMessage = sockets[i].lastMessage;
      if (lastMessage + 1500 > Date.now()) {
        console.log("too many requests");
        console.log(socketID)
        io.emit('slow_down', socketID);
        res.json(data);
        return;
      } else {
        sockets[i].lastMessage = Date.now();
      }
    }
  }

  if (old.name.length > 20) {
    old.name = old.name.substring(0, 20);
  }

  if (old.content.length > 1000) {
    old.content = old.content.substring(0, 1000);
  }
=======
>>>>>>> d8adea7b781e5f63cd0b58265e76c63cecc8268f

  let message = {
    name: old.name,
    avatar: old.avatar,
    id: Math.floor(Math.random() * 89999999999999999) + 10000000000000000,
    
    timestamp: Date.now(),
    content: old.content,
  }

  data.push(message);

  io.emit('update', data);
  res.json(data);
});

io.on('connection', function(socket) {
  socket.emit('family_gathering', socket.client.id);
  console.log('a user connected');
  let socketID = socket.client.id;
  socket.join(socketID);

  let socketData = {
    id: socketID,
    lastMessage: 0,
  }

  sockets.push(socketData);

  usersConnected++;
  console.log(usersConnected + " users connected");
  socket.on('disconnect', function() {
    console.log('user disconnected');
    usersConnected--;
    console.log(usersConnected + " users connected");
  });
});

server.listen(4000, function() {
  console.log('Listening on port 4000');
});
