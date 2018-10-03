var socket = io('http://localhost');

function addNode(type) {
	socket.emit('addNode', {type: type});
}

function requestData(data) {
	socket.emit('requestData', data);
}

function pbft() {
	socket.emit('pbft');
}

socket.on('requestPrimary', (data, callback) => {
	var d = new Date();
	var t = d.getTime();
	console.log(data.from + " -> " + data.to + " --- " + (t-data.timestamp));
	callback(data, t);
})

socket.on('requestReplica', (data, callback) => {
	callback();
})