var express = require('express');
var app = express();
var https = require('https');
var io = require('socket.io')(https);
const fs = require("fs");

const port = process.env.PACMAN_SERVER_PORT || 3000;

const httpsOptions = {
  key: fs.readFileSync("./key/test_key.pem", "utf-8"),
  cert: fs.readFileSync("./key/test_cert.pem", "utf-8"),
}

let timer = 0;
app.use(express.static(__dirname + "/dist")); //Serves resources from public folder
app.use(express.static(__dirname + "/src")); //Serves resources from public folder

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});
app.get('/move', function (req, res) {
  io.emit('action', {
      action: req.query.action,
      player: req.query.player
    }
  );

  res.jsonp({
    status: 200
  });

});
io.on('connection', function (socket) {
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

https.createServer(httpsOptions, app) .listen(port, function () {
  console.log("Pacman server is running on " + port);
});
