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

	socket.on('pbft', () => {
		PBFT();
	})
});

var faultyNodes = 1;
var totalNodes = 3*faultyNodes + 1;
var primaryNodes = 1;
var replicaNodes = 3*faultyNodes;

var checkNodes = () => {
	var p = io.sockets.adapter.rooms['primary'].length;
	var r = io.sockets.adapter.rooms['replica'].length;
	if(p==primaryNodes && r==replicaNodes && totalNodes==p+r)
		return true;
	else 
		return false;
}

var startTime;

function PtoR(time) {

}

function CtoP(data, time) {
	console.log("Client to primary - " + time);
	// io.in('replica').emit('requestReplica', data, PtoR);
}

var PBFT = () => {
	if(checkNodes()) {
		var d = new Date();
		var t = d.getTime();
		startTime = t;
		var data = {
			from: 'client',
			to : 'primary',
		}
		io.in('primary').emit('requestPrimary', data, CtoP);
	} else {
		console.log("Nodes missing");
	}
}