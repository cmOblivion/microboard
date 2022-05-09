const { create : createApp } = require('./src/index.js');

// 引入配置
var options = require('./config.js');

// 创建服务
let server;
createApp(options).then(sv => {
	server = sv;
	
	// 开启服务
	server.start();
});
