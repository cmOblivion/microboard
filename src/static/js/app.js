import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.5.0/dist/socket.io.esm.min.js";
import actions from "./action.js";

export default function createApp(root){
	let app = {
		actions,
		root,
	};

	let socket = app.socket = io();

	socket.once('config',actions.configure.bind(app));
	socket.emit('request-config');

	return app;
}