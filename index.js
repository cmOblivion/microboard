const server = require('./server'),
	{ readFileSync } = require('fs');

const options = JSON.parse(readFileSync('./config.json').toString());

if (process.env.PORT) {
	options.port = process.env.PORT;
}

const sv = server.start(options);