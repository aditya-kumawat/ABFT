var socket = io('http://localhost');

function addNode(type) {
	socket.emit('addNode', {type: type});
}

function requestData(data) {
	socket.emit('requestData', data);
}

socket.on('requestData', (data) => {
	var d = new Date();
	var t = d.getTime();
	console.log(data.from + " -> " + data.to + " --- " + (t-data.timestamp));
})