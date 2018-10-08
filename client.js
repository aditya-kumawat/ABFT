var socket = io('http://localhost');

var getTime = () => {
	var d = new Date();
	var t = d.getTime();
	return t;
}

function addNode(type) {
	socket.emit('addNode', {type: type});
}

function request() {
	socket.emit('request');
}

function prePrepare() {
	socket.emit('prePrepare');
}

function pbft() {
	socket.emit('pbft');
}

socket.on('request', (data) => {
	data.rTime = getTime();
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('prePrepare', (data) => {
	data.rTime = getTime();
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

// socket.on('requestPrimary', (data, callback) => {
// 	var d = new Date();
// 	var t = d.getTime();
// 	console.log(data.from + " -> " + data.to + " --- " + (t-data.timestamp));
// 	callback(data, t);
// })

socket.on('requestReplica', (data, callback) => {
	callback();
})