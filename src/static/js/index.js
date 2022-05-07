import createApp from "./app.js";

function windowOnload(global){
	var app = global.app = createApp(document.querySelector("#app"));
}

window.addEventListener('load'
		,windowOnload.bind({},window || globalThis));