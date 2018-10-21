const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const fs = require("fs");

const httpsPort = process.env.PACMAN_HTTPS_SERVER_PORT || 3000;
const httpPort = process.env.PACMAN_HTTP_SERVER_PORT || 3001;

const httpsOptions = {
  key: fs.readFileSync("./key/test_key.pem", "utf-8"),
  cert: fs.readFileSync("./key/test_cert.pem", "utf-8"),
};

const httpsServer = https.createServer(httpsOptions, app);
const httpServer = http.createServer(app);
const io = require('socket.io').listen(httpsServer).listen(httpServer);

app.use(express.static(__dirname + "/dist")); //Serves resources from public folder

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/move', function (req, res) {
  io.emit('action', {
    action: req.query.action,
    token: req.query.token
  }

 );

  res.jsonp({
    status: 200
  });

});

io.on('connection', function (socket) {
  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
});

httpsServer.listen(httpsPort, function () {
  console.log("https server is running on " + httpsPort);
});

httpServer.listen(httpPort, function () {
  console.log("http server is running on " + httpPort);
});