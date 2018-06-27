const express = require('express');
const path = require('path');
const io = require("socket.io")();

const Attacks = require("./attacks");
const data = require("./data");

const ATTACK_INTERVAL = 5 * 1000; // 5 seconds

const app = express();

const threats = [...data.threatData]; // TODO: get real data 

let uniqueKey = 0;

// apps up html/css/js files
app.use(express.static(path.join(__dirname, '../dist')));


// api route 
app.get("/rest/data", (req, res) => {

	const threat1 = Attacks.generateData();
	const threat2 = Attacks.generateData();

	res.status("200").json({
		success: true,
		message: "New threats discovered.",
		threats: [threat1, threat2]
	});
});


// start app at port 8080
const server = app.listen(8080, () => {
	// eslint-disable-next-line 
	console.info("Server listening on port 8080!");
	
	setInterval(()=>{

		const threat1 = Attacks.generateData();
		const threat2 = Attacks.generateData();

		io.emit("threats-discovered", { message: "New threats discovered.", threats: [threat1, threat2] });

		// console.info(`\nNew Threat: ${JSON.stringify(threat1)}\n`);
		// console.info(`New Threat: ${JSON.stringify(threat2)}\n`);

		// eslint-disable-next-line 
		console.info(`\nThreat Data Count: ${threats.length}\n`);

	}, ATTACK_INTERVAL);
});

io.attach(server);

io.on("connection", client => {

	// emit messages to other clients 
	client.on("message", clientData => {
		client.broadcast.emit("message", clientData);

		// console.info(`socket-${client.id}: ${clientData}.`);
	});
});


