/**
 * Microboard配置文件
 */

module.exports = {
	// 服务器配置信息
	server:{
		port:process.env.PORT || 80,	// 在heroku中需使用heroku提供的端口
		staticpath:'/static',	// 静态文件路由地址，没事别改，改了需要改模板
	},
	// 数据库配置信息
	db:{
		db:0,	// redis数据库数据表要使用数字
		type:'redis',	// 目前只支持redis数据库
		// redis数据库url在heroku中需使用heroku提供的url
		url:process.env.REDIS_URL || 'redis://cm:Czh20090301!@redis-18146.c294.ap-northeast-1-2.ec2.cloud.redislabs.com:18146/',
	},
	// 放给客户端的配置信息
	client:{
		style:'default'
	},
};