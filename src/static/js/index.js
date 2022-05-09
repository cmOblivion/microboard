import { createApp } from "./app.js";

((global) => {
	var app = global.app = createApp('#app');
})(window || globalThis);