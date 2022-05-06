function createGame(sel){
	socket.on('send-options',(options) => {
		game.COLORS = options.COLORS;
		game.options = options;

		game.makeButtons();

		game.canvas.width = options.boardSize.width * options.canvas.blockWidth;
		game.canvas.height = options.boardSize.height * options.canvas.blockHeight;
		game.canvas.classList.add('game');
		game.root.appendChild(game.canvas);

		game.draw();
	});

	let game = {};

	game.root = document.querySelector(sel);

	game.canvas = document.createElement('canvas');
	game.ctx = game.canvas.getContext('2d');

	game.activeColor = 0;

	game.board = fetchBoard(game);
	game.drawBlock = (pos,color) => {
		game.ctx.fillStyle = game.COLORS[color];
		game.ctx.fillRect(pos.x * game.options.canvas.blockWidth
				,pos.y * game.options.canvas.blockHeight
				,game.options.canvas.blockWidth
				,game.options.canvas.blockHeight);
	};

	game.draw = () => {
		for (let i in game.board) {
			for (let j in game.board[i]) {
				game.drawBlock({x:j,y:i},game.board[i][j]);
			}
		}
	};

	function $$button(color,button){
		return () => {
			game.activeColor = color;
			game.updateButtonState();
		}
	}

	game.makeButtons = () => {
		for (let color in game.COLORS) {
			let button = document.createElement('button');

			button.addEventListener('click',$$button(color,button));
			button.style['background-color'] = game.COLORS[color];
			button.id = 'c'+color;

			game.root.appendChild(button);

			game.updateButtonState();
		}
	};

	game.updateButtonState = () => {
		for (let button of document.querySelectorAll('button')) {
			button.className = 'bt';
		}

		document.querySelector(`button#c${game.activeColor}`).className = 'bt btActive';
	}

	socket.emit('get-options');

	const $mdcb = (mpos) => {
		if (game.mousedown) {
			if (game.mousein) {
				let pos = {
					x:parseInt(mpos.clientX/game.options.canvas.blockWidth - 1),
					y:parseInt(mpos.clientY/game.options.canvas.blockHeight - 1)
				};

				if (game.$blockCache) {
					if (game.$blockCache !== pos) {
						socket.emit('change-color',pos,game.activeColor);
						game.$blockCache = pos;
					}
				} else {
					socket.emit('change-color',pos,game.activeColor);
					game.$blockCache = pos;
				}
			}
		}
	};

	game.canvas.addEventListener('mousemove',$mdcb);
	game.canvas.addEventListener('click',(...args) => {
		game.mousedown = true;
		$mdcb(...args);
		game.mousedown = false;
	});

	game.mousedown = false;
	game.$blockCache = null;
	game.canvas.addEventListener('mousedown',() => {
		game.mousedown = true;
	});

	game.canvas.addEventListener('mouseup',() => {
		game.mousedown = false;
	});

	game.mousein = false;
	game.canvas.addEventListener('mouseenter',() => game.mousein = true);
	game.canvas.addEventListener('mouseout',() => game.mousein = false);

	return game;
}

function fetchBoard(game){
	socket.on('fetch-board-back',(bd) => {
		game.board = bd;
	});

	socket.on('change-color',(pos,color) => {
		game.board[pos.y][pos.x] = color;
		game.drawBlock(pos,color);
	});

	socket.emit('fetch-board-request');

	return [];
}

window.onload = () => {
	window.socket = io();	// 连接服务

	window.game = createGame('#game');
}