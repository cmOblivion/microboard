/**
 * 数据库支持：
 * redis
 */

module.exports = {
	// 连接数据库
	async connect(options){
		if (options.type === 'redis') {
			const { createClient } = require('redis');

			let client = this.client = createClient({
				url:options.url,
			});

			try {
				// 连接
				await client.connect();
				await client.select(options.db);
				console.log(`URL ${options.url} 上的数据库${options.db}已连接成功！`);
			} catch (err) {
				console.log(`数据库连接失败！
错误信息：${err.message}`);
			}
		} else {
			throw new Error('暂不支持除了redis的其它数据库！');
		}

		return this;
	},
	async isUsernameExits(username){
		let exists = await this.client.HLEN('u'+username);
		return exists !== 0;
	},
	async register(user){
		await this.client.HSET('u'+user.username,'n'/* 用户名前缀 */,user.username);
		await this.client.HSET('u'+user.username,'p'/* 密码前缀 */,user.password);
	},
	async isUser(user){
		const u = await this.client.HGETALL('u'+user.username);
		return u?.n === user.username && u?.p === user.password;
	},
	async getFriendList(username){
		const u = await this.client.SMEMBERS('uf'/* 好友列表前缀 */+username);
		let list = [];
		for (let f of u) {
			list.push({ username:f });
		}

		return list || [];
	},
	async addFriend(me,name){
		let has = await this.isUsernameExits(name);
		if (has) {
			if (await this.client.SISMEMBER('uf'+me,name)) {
				return 2;
			} else {
				await this.client.SADD('uf'+me,name);
				return 1;
			}
		} else {
			return 0;
		}
	},
	async deleteFriend(me,name){
		let has = await this.isUsernameExits(name);
		if (has) {
			await this.client.SREM('uf'+me,name)
			return 0;
		} else {
			return 1;
		}
	}
};