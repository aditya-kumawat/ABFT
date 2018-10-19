var socket = io('http://localhost');

var val = new Set();
var valNoWait = new Array();
var payload = new Set();
var payloadNoWait = new Array();
var cData = new Array();
var cDataSet = new Set();

var prePrepareFlag = true;
var commitFlag = true;
var replyFlag = true;

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

function commitReply() {
	socket.emit('commitReplyS');
}

function abft() {
	socket.emit('requestNoWaitS');
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
	val.add(data.val);
	data.rTime = getTime();
	data.v = socket.id;
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
	payload.add(data.payload);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));
})

socket.on('replyS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	if(payload.size==1) {
		socket.emit('replyR', data);
	}
})

socket.on('replyR', (data) => {
	cData.push(data.payload);
	cDataSet.add(data.payload);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + data.payload + " ----- " + (data.rTime - data.sTime));

	if(cData.length==data.totalNodes && cDataSet.size==1) {
		data.fTime = getTime();
		console.log(data.payload + " ----- " + (data.fTime - data.sTime));
	}
})

socket.on('commitReplyS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	socket.emit('commitReplyR', data);
})

socket.on('commitReplyR', (data) => {
	cData.push(data.payload);
	cDataSet.add(data.payload);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + data.payload + " ----- " + (data.rTime - data.sTime));

	if(cData.length==2*data.faultyNodes+1 && cDataSet.size==1) {
		data.fTime = getTime();
		console.log(data.payload + " ----- " + (data.fTime - data.sTime));
	}
})

socket.on('requestNoWaitS', (data) => {
	data.sTime = getTime();
	data.u = socket.id;
	socket.emit('requestNoWaitR', data);
})

socket.on('requestNoWaitR', (data) => {
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));

	data.u = socket.id;
	socket.emit('prePrepareNoWaitR', data);
})

socket.on('prePrepareNoWaitR', (data) => {
	valNoWait.push(data.val);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));

	data.u = socket.id;
	if(prePrepareFlag==true && valNoWait.length==2) {
		prePrepareFlag = false;
		// socket.emit('commitNoWaitR', data);
		socket.emit('commitReplyNoWaitR', data);
	}
})

socket.on('commitNoWaitR', (data) => {
	payloadNoWait.push(data.payload);
	payload.add(data.payload);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + (data.rTime - data.sTime));

	data.u = socket.id;
	if(commitFlag==true && payload.size==1 && payloadNoWait.length==data.faultyNodes+1) {
		commitFlag = false;
		socket.emit('replyNoWaitR', data);
	}
})

socket.on('replyNoWaitR', (data) => {
	cData.push(data.payload);
	cDataSet.add(data.payload);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + data.payload + " ----- " + (data.rTime - data.sTime));

	if(replyFlag==true && cData.length==2 && cDataSet.size==1) {
		replyFlag = false;
		data.fTime = getTime();
		console.log(data.payload + " ----- " + (data.fTime - data.sTime));
	}
})

socket.on('commitReplyNoWaitR', (data) => {
	cData.push(data.payload);
	cDataSet.add(data.payload);
	data.rTime = getTime();
	data.v = socket.id;
	console.log(data.from + " - " + data.u + " -> " + data.to + " - " + data.v + " --- " + data.payload + " ----- " + (data.rTime - data.sTime));
	
	if(replyFlag==true && cData.length==data.faultyNodes+1 && cDataSet.size==1) {
		replyFlag = false;
		data.fTime = getTime();
		console.log(data.payload + " ----- " + (data.fTime - data.sTime));
	}
})