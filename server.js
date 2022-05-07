const { create } = require('./src/index.js');

// 引入配置
var options = require('./config.js');

// 创建服务
const server = create(options);

// 开启服务
server.start();