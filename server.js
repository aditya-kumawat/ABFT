var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var faultyNodes = 1;
var totalNodes = 3*faultyNodes + 1;
var primaryNodes = 1;
var replicaNodes = 3*faultyNodes;

var getTime = () => {
	var d = new Date();
	var t = d.getTime();
	return t;
}

io.on('connection', function (socket) {
	socket.on('addNode', (data) => {
		socket.join(data.type);
	})

	socket.on('requestS', () => {
		var t = getTime();
		var data = {
			from: 'client',
			to: 'primary',
		};
		io.to(data.from).emit('requestS', data);
	})

	socket.on('requestR', (data) => {
		io.to(data.to).emit('requestR', data);
	})

	socket.on('prePrepareS', () => {
		var t = getTime();
		var data = {
			from: 'primary',
			to: 'replica',
		};
		io.to(data.from).emit('prePrepareS', data);
	})

	socket.on('prePrepareR', (data) => {
		io.to(data.to).emit('prePrepareR', data);
	})

	socket.on('prepareS', () => {
		var t = getTime();
		var data = {
			from: 'replica',
			to: ['primary', 'replica'],
			val: 1,
		};
		io.to(data.from).emit('prepareS', data);
	})

	socket.on('prepareR', (data) => {
		io.to(data.to[0]).to(data.to[1]).emit('prepareR', data);
	})

	socket.on('commitS', () => {
		var t = getTime();
		var data = {
			from: ['primary', 'replica'],
			to: ['primary', 'replica'],
		};
		io.in(data.from[0]).in(data.from[1]).emit('commitS', data);
	})

	socket.on('commitR', (data) => {
		io.in(data.to[0]).in(data.to[1]).emit('commitR', data);
	})
});