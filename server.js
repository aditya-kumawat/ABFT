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

var sendData = (data, emitType) => {
	io.to(data.from).emit(emitType, data);
}

var receiveData = (data, emitType) => {
	io.to(data.to).emit(emitType, data);
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
		sendData(data, 'requestS');
	})

	socket.on('requestR', (data) => {
		receiveData(data, 'requestR');
	})

	socket.on('prePrepareS', () => {
		var t = getTime();
		var data = {
			from: 'primary',
			to: 'replica',
		};
		sendData(data, 'prePrepareS');
	})

	socket.on('prePrepareR', (data) => {
		receiveData(data, 'prePrepareR');
	})

	socket.on('prepareS', () => {
		var t = getTime();
		var data = {
			from: 'replica',
			to: 'replica',
		};
		sendData(data, 'prepareS');
	})

	socket.on('prepareR', (data) => {
		receiveData(data, 'prepareR');
	})	
});