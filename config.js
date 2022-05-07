module.exports = {
	server:{
		port:process.env.PORT || 80,	// 在heroku中需使用heroku提供的端口
		staticpath:'/static',
	},
	db:{
		type:'redis',
		url:'redis://cm:Czh20090301!@redis-18146.c294.ap-northeast-1-2.ec2.cloud.redislabs.com:18146/',
	},
	client:{
		
	}
}