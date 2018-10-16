var socket = io('http://localhost');

var val = new Set();
var payload = new Set();
var cData = new Array();
var cDataSet = new Set();

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

function reply() {
	socket.emit('replyS');
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
	val.add(data.val);
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('commitS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	if(val.size==1) {
		socket.emit('commitR', data);
	}
})

socket.on('commitR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	payload.add(data.payload);
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('replyS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	if(payload.size==1) {
		// console.log(cData);
		// console.log(cDataSet);
		socket.emit('replyR', data);
	}
})

socket.on('replyR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + data.payload + " ----- " + (data.rTime - data.sTime));
	cData.push(data.payload);
	cDataSet.add(data.payload);
	if(cData.length==data.totalNodes && cDataSet.size==1) {
		data.fTime = getTime();
		console.log(data.payload + " ----- " + (data.fTime - data.sTime));
	}
})