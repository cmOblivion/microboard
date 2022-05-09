const express = require("express"),
	{ createServer } = require("http"),
	{ Server } = require("socket.io"),
	{ join } = require("path"),
	db = require('./db');

async function create(options){
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

		sv.app.get('/favicon.ico',(req,res) => {
			res.sendFile(join(sv.dir,'static/logo.png'));
		});

		sv.io.on('connection',sv.connect);

		// 连接数据库
		db.connect(sv.options.db).then((db) => sv.db = db);

		// 开始监听
		sv.http.listen(sv.options.server.port,
				() => console.log(`服务已运行在端口${sv.options.server.port}上！`));
	};

	sv.connect = (socket) => {
		socket.on('register',(data) => {
			let exists;

			sv.db.isUsernameExits(data.username).then(result => {
				exists = result;

				if (exists) {
					socket.send({
						code:400,
						message:'用户名已存在！',
					});
				} else {
					sv.db.register(data).then(err => {
						if (!err) {
							socket.send({
								code:200,
								message:'注册成功！',
							});
						} else {
							socket.send({
								code:500,
								message:'发生未知错误！',
							});
						}
					});
				}
			});
		});

		socket.on('login',(user) => {
			sv.db.isUser(user).then((isuser) => {
				if (isuser) {
					socket.data.username = user.username;
					socket.data.password = user.password;
					socket.send({
						code:200,
						message:'已登录！',
					});
				} else {
					socket.send({
						code:400,
						message:'登录失败！',
					});
				}
			});
		});
	};

	return server;
}

exports.create = create;