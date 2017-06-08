const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

var app = express();
app.set('port', (process.env.PORT || 3000));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var markerData = JSON.parse(fs.readFileSync(__dirname + '/markers.json', 'utf8'));
console.log(markerData);

wss.on('connection', function(ws){
    console.log("A user connected");
    ws.send(JSON.stringify(markerData));

    ws.on('message', function(message){
        console.log(message);
        data = JSON.parse(message);
        if(data.type === 'add'){
            markerData.markers.push({'name': data.name, 'latlng': data.latlng})
        } else if (data.type === 'delete') {
            markerData.markers.splice(data.index, 1);
            console.log("Marker deleted.");
        }
    });
});

server.listen(app.get('port'), function() {
    console.log('Now listening on port ' + app.get('port'));
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//markerData = {'markers': []}


process.on('exit', function() {
    fs.writeFileSync(__dirname + '/markers.json', JSON.stringify(markerData), 'utf8');
});

process.on('SIGINT', function() {
    console.log("recognized interupt");
    console.log(markerData);
    process.exit();
});
