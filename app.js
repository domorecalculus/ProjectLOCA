var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function() {
    console.log('Now listening...');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/js/map.js', function(req, res) {
    res.sendFile(__dirname + '/js/map.js');
});

io.on('connection', function(socket){
    socket.on('')
});
