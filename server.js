const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

// credits
// javascript
// node.js
// express
// socket.io

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let usersConnected = 0;

let data = [ 
  {
    name: "Anon",
    avatar: "",
    // id is a random number between 10000000000000000 and 99999999999999999 (dont convert to decimal)
    id: Math.floor(Math.random() * 89999999999999999) + 10000000000000000,

    timestamp: Date.now(),
    content: "Hm.",
  },

  {
      name: "Anon",
      avatar: "",
      id: Math.floor(Math.random() * 89999999999999999) + 10000000000000000,

      timestamp: Date.now(),
      content: "Hm, indeed.",

  },
];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  // server style sheet
  app.use('/style.css', express.static(__dirname + '/style.css'));
  // serve socket.io client library
  app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));
});

app.get('/data', function(req, res) {
  res.json(data);
});

app.post('/data', function(req, res) {
  console.log("post request received");

  let message = req.body.data;
  message.id = Math.floor(Math.random() * 89999999999999999) + 10000000000000000;
  // add id to message

  message = JSON.parse(message);

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