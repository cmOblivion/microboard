import routes from "./routes.js";
import components from "./components.js";
import { vm,setVM } from "./vm.js";

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
				friendlist:[],
				needGetList:false,
			};
		},
		created(){
			setVM(this);
		},
		mounted(){
			this.checkLogined();
		},
		methods:{
			// 检测登录状态
			checkLogined(){
				if (this.user !== null) {
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

						if (this.needGetList) {
							this.getFriendList();
						}
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
			register(form,child){
				io.once('message',(result) => {
					if (result.code === 200) {
						ElementPlus.ElNotification({
							type:'success',
							title:'提示',
							message:result.message,
						});

						child.registering = false;

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

				io.emit('logout');

				setTimeout(() => {
					ElementPlus.ElNotification({
						type:'success',
						message:'登出成功！',
						title:'提示',
						duration:1500,
					});
				},80);
			},
			getFriendList(){
				this.needGetList = true;
				this.waitForLogined(() => {
					io.once('friends',(result) => {
						this.friendlist = result;
					});

					io.emit('friends');
				});
			},
			waitForLogined(cb,...args){
				var id = setInterval(() => {
					if (this.logined) {
						cb(...args);
						clearInterval(id);
					}
				},50);
			},
			addFriend(name,success){
				io.once('message',(result) => {
					this.getFriendList();

					if (result.code === 200) {
						ElementPlus.ElNotification({
							type:'success',
							message:result.message,
							title:'提示',
							duration:2000,
						});

						success();
					} else {
						ElementPlus.ElNotification({
							type:'error',
							message:result.message,
							title:'错误',
							duration:2000,
						});
					}
				});

				io.emit('add-friend',name);
			},
			deleteFriend(name){
				io.once('message',(result) => {
					if (result.code === 200) {
						ElementPlus.ElNotification({
							type:'success',
							message:result.message,
							title:'提示',
							duration:2000,
						});

						this.getFriendList();
					} else {
						ElementPlus.ElNotification({
							type:'error',
							message:result.message,
							title:'错误',
							duration:2000,
						});
					}
				});

				io.emit('delete-friend',name);
			},
			sendMessage(to,msg){

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
	app.component('mb-friend',components.Friend);

	// 引入element-plus的图标
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component);
	}

	app.mount(root);

	return app;
}