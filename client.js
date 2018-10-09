var socket = io('http://localhost');

var rData = new Set();

var getTime = () => {
	var d = new Date();
	var t = d.getTime();
	return t;
}

function addNode(type) {
	socket.emit('addNode', {type: type});
}

function request() {
	socket.emit('requestS');
}

function prePrepare() {
	socket.emit('prePrepareS');
}

function prepare() {
	socket.emit('prepareS');
}

function commit() {
	socket.emit('commitS');
}

socket.on('requestS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	socket.emit('requestR', data);
})

socket.on('requestR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('prePrepareS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	socket.emit('prePrepareR', data);
})

socket.on('prePrepareR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('prepareS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	socket.emit('prepareR', data);
})

socket.on('prepareR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	rData.add(data.val);
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('commitS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	socket.emit('commitR', data);
})

socket.on('commitR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	if(rData.size==1) {
		console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
	}
})

// socket.on('request', (data) => {
// 	data.rTime = getTime();
// 	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
// })

// socket.on('prePrepare', (data) => {
// 	data.rTime = getTime();
// 	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
// })

// // socket.on('requestPrimary', (data, callback) => {
// // 	var d = new Date();
// // 	var t = d.getTime();
// // 	console.log(data.from + " -> " + data.to + " --- " + (t-data.timestamp));
// // 	callback(data, t);
// // })

// socket.on('requestReplica', (data, callback) => {
// 	callback();
// })