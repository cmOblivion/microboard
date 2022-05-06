const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { EventEmitter } = require('events');
const path = require('path');


module.exports = {
	start(options){
		this.init(options);

		return this;
	},
	init(options){
		this.app = express(),
		this.sv = http.createServer(this.app)
		this.io = new Server(this.sv);
		this.sockets = {};
		this.options = options;

		this.initBoard();

		this.app.use(express.static(path.join(__dirname,'static')));

		this.io.on('connection', (socket) => {
			console.log('有人来了！');
			this.sockets[socket.id] = socket;

			socket.on('disconnect',() => {
				delete this.sockets[socket.id];
			});

			socket.on('fetch-board-request',() => {
				socket.emit('fetch-board-back',this.board.content);
			});

			socket.on('change-color',(pos,color) => {
				console.log(`change-color (${pos.x},${pos.y}) to ${this.options.COLORS[color]}`);
				this.board.emit('change-color',pos,color);

				for (let i in this.sockets) {
					this.sockets[i].emit('change-color',pos,color);
				}
			});

			socket.on('get-options',() => {
				socket.emit('send-options',options);
			})
		});

		this.sv.listen(options.port, () => {
			console.log(`服务器已经运行在http://localhost:${options.port}/上！`);
		});
	},
	initBoard(){
		this.board = new EventEmitter();
		this.board.content = [];

		for (let i = 0;i < this.options.boardSize.height;i++) {
			this.board.content[i] = [];

			for (let j = 0;j < this.options.boardSize.width;j++) {
				this.board.content[i][j] = this.options.initialColor;
			}
		}

		this.board.on('change-color',(pos,color) => {
			if (this.board.content[pos.y]) {
				this.board.content[pos.y][pos.x] = color;
			}
		})
	}
}