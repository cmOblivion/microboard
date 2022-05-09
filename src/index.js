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
		socket.data.logined = false;

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
					socket.data.logined = true;
					socket.data.user = {};
					socket.data.user.username = user.username;
					socket.data.user.password = user.password;
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

		socket.on('logout',() => {
			socket.data.logined = false;
			socket.data.user = null;
		});

		socket.on('friends',() => {
			if (socket.data.logined) {
				sv.db.getFriendList(socket.data.user.username).then((result) => {
					socket.emit('friends',result);
				});
			} else {
				socket.emit('friends',[]);
			}
		});

		socket.on('add-friend',(name) => {
			if (socket.data.logined) {
				sv.db.addFriend(socket.data.user.username,name).then((result) => {
					if (result === 1) {
						socket.send({
							code:200,
							message:'添加好友成功！',
						});
					} else if (result === 0) {
						socket.send({
							code:400,
							message:'好友不存在！',
						});
					} else if (result === 2) {
						socket.send({
							code:400,
							message:'他（她）已经是你好友了！',
						});
					}
				});
			} else {
				socket.send({
					code:400,
					message:'请先登录！',
				});
			}
		});

		socket.on('delete-friend',(name) => {
			if (socket.data.logined) {
				sv.db.deleteFriend(socket.data.user.username,name).then((result) => {
					if (result === 0) {
						socket.send({
							code:200,
							message:'删除好友成功！',
						});
					} else {
						socket.send({
							code:500,
							message:'未知错误！',
						});
					}
				});
			} else {
				socket.send({
					code:400,
					message:'请先登录！',
				});
			}
		});
	};

	return server;
}

exports.create = create;