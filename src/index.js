const express = require("express"),
	{ createServer } = require("http"),
	{ Server } = require("socket.io"),
	{ join } = require("path"),
	db = require('./db');

function create(options){
	let server = sv = {
		options,
		dir:__dirname
		// db
	};

	// 开始服务方法
	sv.start = () => {

		// 创建服务
		sv.app = express();
		sv.http = createServer(sv.app);
		sv.io = new Server(sv.http, {});	// socket.io 服务

		// 静态文件路由
		sv.app.use(sv.options.server.staticpath,express.static(join(sv.dir,'static')));

		// 首页发送文件
		sv.app.get('/',(req,res) => {
			res.sendFile(join(sv.dir,'static/index.html'));
		});

		sv.io.on('connection',sv.connect);

		// 连接数据库
		db.connect(sv.options.db).then((db) => sv.db = db);

		// 开始监听
		sv.http.listen(sv.options.server.port,
				() => console.log(`服务已运行在端口${sv.options.server.port}上！`));
	};

	sv.connect = (socket) => {
		socket.on('request-config',() => {
			socket.emit('config',sv.options.client);
		})
	};

	return server;
}

exports.create = create;