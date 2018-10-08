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
var startTime;

var nodes = {
	'client': [],
	'primary': [],
	'replica': []
}

// var checkNodes = () => {
// 	var p = io.sockets.adapter.rooms['primary'].length;
// 	var r = io.sockets.adapter.rooms['replica'].length;
// 	if(p==primaryNodes && r==replicaNodes && totalNodes==p+r)
// 		return true;
// 	else 
// 		return false;
// }


// function PtoR(time) {

// }

// function CtoP(data, time) {
	// console.log("Client to primary - " + time);
	// io.in('replica').emit('requestReplica', data, PtoR);
// }

var getTime = () => {
	var d = new Date();
	var t = d.getTime();
	return t;
}

var sendData = (data, emitType) => {
	for(var u of nodes[data.from]) {
		for(var v of nodes[data.to]) {
			data.u = u;
			data.v = v;
			// console.log(data);
			io.to(v).emit(emitType, data);
		}
	}
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

io.on('connection', function (socket) {
	socket.on('addNode', (data) => {
		nodes[data.type].push(socket.id);
		console.log(nodes);
	})

	socket.on('request', () => {
		var t = getTime();
		var data = {
			from: 'client',
			to: 'primary',
			sTime: t,
		};
		sendData(data, 'request');
	})

	socket.on('prePrepare', () => {
		var t = getTime();
		var data = {
			from: 'primary',
			to: 'replica',
			sTime: t,
		};
		sendData(data, 'prePrepare');
	})

	socket.on('pbft', () => {
		PBFT();
	})
});