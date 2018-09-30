var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	socket.on('addNode', (data) => {
		socket.join(data.type, () => {
			console.log(socket.rooms);
		});
	})

	socket.on('requestData', (data) => {
		var d = new Date();
		data.timestamp = d.getTime();
		io.in('primary').emit('requestData', data);
	})
});