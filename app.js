var app = require('express')();
var server = require('http').Server(app);
const WebSocket = require('ws');
const ws = WebSocket('ws://localhost:3000');
//var io = require('socket.io')(server);
//var fs = require('fs');

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
    console.log("A user connected.");

    /*socket.on('addedMarker', function(data){

    });

    socket.on('removedMarker', function(data){

    });*/

    socket.on('disconnect', function(){
        console.log("A user disconnected.");
    });
});
