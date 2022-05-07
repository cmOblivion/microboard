module.exports = {
	async connect(options){
		if (options.type === 'redis') {
			const { createClient } = require('redis');

			let client = this.client = createClient({
				url:options.url,
			});

			// 连接
			client.connect().then(() => {
				
			});
		} else {
			throw new Error('暂不支持除了redis的其它数据库！');
		}

		return this;
	}
};