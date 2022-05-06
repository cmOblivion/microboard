const server = require('./server'),
	{ readFileSync } = require('fs');

const options = JSON.parse(readFileSync('./config.json').toString());

const sv = server.start(options);