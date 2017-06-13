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
        markerData.markers.push({'name': row.name, 'latlng': {lat: row.lat, lng: row.lng}})
        console.log(JSON.stringify(row));
      });
    console.log("markerData: " + markerData);
    ws.send(JSON.stringify(markerData));
  });

  ws.on('message', function(message){
      console.log(message);
      data = JSON.parse(message);
      if(data.type === 'add'){
          pg.defaults.ssl = true;
          pg.connect(process.env.DATABASE_URL, function(err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Adding marker.');

            client
              .query('INSERT INTO Markers VALUES(' + data.name + ',' + data.latlng.lat + ',' + data.latlng.lng + ');')
          });

          //Pre-database
          markerData.markers.push({'name': data.name, 'latlng': data.latlng})
      } else if (data.type === 'delete') {
          pg.defaults.ssl = true;
          pg.connect(process.env.DATABASE_URL, function(err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Deleting marker.');

            client
              .query('DELETE FROM Markers WHERE Lat = ' + markerData.markers[data.index].latlng.lat + ';')
              .on('row', function(row) {
                console.log(JSON.stringify(row));
              });
          });

          //Pre-database
          markerData.markers.splice(data.index, 1);
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
