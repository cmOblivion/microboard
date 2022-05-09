import routes from "./routes.js";
import components from "./components.js";

let sio = io;	// 缓存socket.io

export function createApp(root){
	var io = sio();
	io.connect();

	var router = VueRouter.createRouter({
		history:VueRouter.createWebHashHistory(),
		routes,
	});

	var app = Vue.createApp({
		data(){
			return {
				logined:true,
				user:null,
			};
		},
		mounted(){
			this.checkLogined();
		},
		methods:{
			// 检测登录状态
			checkLogined(){
				if (this?.io?.get('username') && this?.io?.get('password')) {
					this.logined = true;
				} else {
					if (typeof (Cookies.get('username') 
						&& Cookies.get('password')) !== 'undefined') {
						this.login({
							username:Cookies.get('username'),
							password:Cookies.get('password'),
						});
					} else {
						this.logined = false;
					}
				}
			},
			// 登录，由子组件触发
			login(data){
				io.once('message',(result) => {
					if (result.code === 200) {
						ElementPlus.ElNotification({
							type:'success',
							title:'提示',
							message:result.message,
						});

						this.logined = true;

						Cookies.set('username',data.username
								,{ expires: 15 });
						Cookies.set('password',data.password
								,{ expires: 15 });

						this.user = {
							username:data.username,
							password:data.password,
						};
					} else {
						ElementPlus.ElNotification({
							type:'error',
							title:'错误',
							message:result.message,
						});
					}
				});

				io.emit('login',data);
			},
			// 注册，由子组件触发
			register(form){
				io.once('message',(result) => {
					if (result.code === 200) {
						ElementPlus.ElNotification({
							type:'success',
							title:'提示',
							message:result.message,
						});

						this.login(form);
					} else {
						ElementPlus.ElNotification({
							type:'error',
							title:'错误',
							message:result.message,
						});
					}
				});

				io.emit('register',form);
			},
			// 登出，由子组件触发
			logout(){
				Cookies.remove('username');
				Cookies.remove('password');

				this.logined = false;
				this.user = null;

				io.emit(logout);

				setTimeout(ElementPlus.ElNotification.bind(this,({
					type:'success',
					message:'登出成功！',
					title:'提示',
					duration:1500,
				})),100);
			},
		},
		components:{
			'mb-menu':components.Menu,
			'mb-login':components.Login,
		},
	});
	
	app.io = io;
	app.use(router);
	app.use(ElementPlus);	// 引入element-plus组件库

	// 引入element-plus的图标
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component);
	}

	app.mount(root);

	return app;
}