const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
var pg = require('pg');

var app = express();
app.set('port', (process.env.PORT || 5000));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var markerData = {"markers":[]}; //Pre-database = JSON.parse(fs.readFileSync(__dirname + '/markers.json', 'utf8'));
console.log(markerData);

wss.on('connection', function(ws){
    console.log("A user connected");
    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) throw err;
      console.log('Connected to postgres! Getting markers.');

      client
        .query('SELECT Name,Lat,Lng FROM Markers;')
        .on('row', function(row) {
          console.log(JSON.stringify(row));
        });
    });
    ws.send(JSON.stringify(markerData));

    ws.on('message', function(message){
        console.log(message);
        data = JSON.parse(message);
        if(data.type === 'add'){
            //Pre-database
            //markerData.markers.push({'name': data.name, 'latlng': data.latlng})

            pg.defaults.ssl = true;
            pg.connect(process.env.DATABASE_URL, function(err, client) {
              if (err) throw err;
              console.log('Connected to postgres! Getting markers.');

              client
                .query('SELECT Name,Lat,Lng FROM Markers;')
                .on('row', function(row) {
                  console.log(JSON.stringify(row));
                });
            });
        } else if (data.type === 'delete') {
            //Pre-database
            //markerData.markers.splice(data.index, 1);

            pg.defaults.ssl = true;
            pg.connect(process.env.DATABASE_URL, function(err, client) {
              if (err) throw err;
              console.log('Connected to postgres! Getting schemas...');

              client
                .query('SELECT table_schema,table_name FROM information_schema.tables;')
                .on('row', function(row) {
                  console.log(JSON.stringify(row));
                });
            });
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
