var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


let timer = 0;
app.use(express.static(__dirname+"/dist" )); //Serves resources from public folder
app.use(express.static(__dirname+"/src" )); //Serves resources from public folder

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});
app.get('/move', function (req, res) {
  io.emit('action', {
    action: req.query.action,
    player: req.query.player
  }
  
 );


  res.jsonp({ status: 200 });

});
io.on('connection', function (socket) {
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});




http.listen(3000, function () {
  console.log('listening on 12 *:3000');
});

