const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let usersConnected = 0;

let data = [];

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
  console.log('a user connected');
  socketID = socket.client.id;
  socket.join(socketID);

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
