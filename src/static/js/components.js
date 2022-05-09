import { vm } from './vm.js';

// 首页组件
let Home = {
	data(){
		vm.$watch('user',() => {
			this.username = vm?.user?.username;
			this.logined = vm.logined;
		});
		return {
			username:vm?.user?.username,
			logined:vm.logined,
		};
	},
	template:`
		<h2 v-if="logined">欢迎，{{ username }}！</h2>
	`,
};

// 菜单组件
let Menu = {
	data(){
		return {
			active:'/',
		};
	},
	template:`
		<el-menu router="true" :default-active="active">
			<el-menu-item index="/">
				<el-icon><house /></el-icon>
				首页
			</el-menu-item>
			<el-menu-item index="/groups">
				<el-icon><connection /></el-icon>
				群组
			</el-menu-item>
			<el-menu-item index="/friends">
				<el-icon><avatar /></el-icon>
				好友
			</el-menu-item>
			<el-sub-menu>
				<template #title>
					<el-icon><setting /></el-icon>
					<span>设置</span>
				</template>
				<el-menu-item index="/home" @click="logout">
					<el-icon><switch-button /></el-icon>
					登出
				</el-form-item>
			</el-sub-menu>
		</el-menu>
	`,
	methods:{
		logout(){
			this.$emit('logout');
		},
	}
};

let Login = {
	props:{ need:Boolean },
	template:`
		<!-- 登录对话框 -->
		<el-dialog
			v-model="need"
			title="登录"
			:before-close="closeLoginDialog"
			draggable="true"
			width="60%"
		>
			<el-form :model="loginform" label-width="80px">
				<el-form-item label="用户名">
					<el-input v-model="loginform.username" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="loginform.password" show-password />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitLogin">登录</el-button>
					<el-button @click="showRegister">注册</el-button>
				</el-menu-item>
			</el-form>

			<!-- 注册对话框 -->
			<el-dialog
				v-model="registering"
				title="注册"
				draggable="true"
				width="45%"
			>
				<el-form :model="registerform" label-width="80px">
					<el-form-item label="用户名">
						<el-input v-model="registerform.username" />
					</el-form-item>
					<el-form-item label="密码">
						<el-input v-model="registerform.password1" show-password />
					</el-form-item>
					<el-form-item label="确认密码">
						<el-input v-model="registerform.password2" show-password />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitRegister">注册</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-dialog>
	`,
	data(){
		return {
			loginform:{
				username:'',
				password:'',
			},
			registering:false,
			registerform:{
				username:'',
				password1:'',
				password2:'',
			}
		};
	},
	methods:{
		closeLoginDialog(){
			ElementPlus.ElMessage({
				type:'warning',
				message:'请先登录！',
				showClose:true,
				center:true,
				duration:1800,
			})
		},
		showRegister(){
			this.registering = true;
		},
		submitLogin(){
			this.$emit('login',this.loginform);
		},
		submitRegister(){
			let form = this.registerform;

			if (form.password1 === form.password2) {
				this.$emit('register',{
					username:form.username,
					password:form.password1,
				},this);
			} else {
					ElementPlus.ElNotification({
						type:'error',
						title:'错误',
						message:'两次密码不一致！',
					});
			}
		},
	}
};

let NotFound = {
	template:`
		<img class="not-found" src="https://cdn.jsdelivr.net/gh/pratik23rj/404_page/error.svg"></img>
	`,
};

let Friends = {
	template:`
		<el-card class="friend-option-card">
			<el-button type="primary" @click="addFriend" :icon="Plus">
				添加好友
			</el-button>
		</el-card>
		<div v-for="(f,i) in list">
			<el-card class="friend-card" shadow="hover">
				<div class="friend-card-header">
					<span>{{ f.username }}</span>
					<el-button-group>
						<el-button type="primary" :icon="ChatDotRound" @click="chat(f.username)">聊天</el-button>
						<el-button :icon="Delete" @click="deleteFriendConfirm(f.username)">删除</el-button>
					</el-button-group>
				</div>
			</el-card>
		</div>

		<el-card class="friend-card" shadow="hover" v-if="hasFriend">
			<div class="friend-card-header">
				<span>还想还没有好友哦，快去叫几个小伙伴吧~</span>
			</div>
		</el-card>

		<el-dialog 
			v-model="isAddingFriend" 
			width="600px"
			title="添加好友"
			draggable="true"
			center="true"
		>
			<el-input placeholder="好友名" v-model="friendname" />
			<template #footer>
				<el-button type="primary" @click="submitAddFriend">添加</el-button>
			</template>
		</el-dialog>

		<el-dialog
			v-model="deleteConfirm"
			title="确认"
			center="true"
			width="400px"
		>
			<span>确认删除好友 {{ confirmUser }} 吗？（聊天记录不会删除）</span>
			<template #footer>
				<el-button type="primary" @click="deleteFriend">确认</el-button>
				<el-button @click="this.deleteConfirm=false">取消</el-button>
			</template>
		</el-dialog>

		<mb-friend 
			:show="isChatting"
			:friend="chatUser"
		>
		</mb-friend>
	`,
	data(){
		return {
			list:vm.friendlist,
			hasFriend:false,
			isAddingFriend:false,
			friendname:'',
			ChatDotRound:ElementPlusIconsVue.ChatDotRound,
			Plus:ElementPlusIconsVue.Plus,
			Delete:ElementPlusIconsVue.Delete,
			deleteConfirm:false,
			confirmUser:'',
			isChatting:false,
			chatUser:'',
		};	
	},
	created(){
		vm.$watch('friendlist',() => {
			this.list = vm.friendlist;
			this.hasFriend = !this.list.length;
		});

		vm.getFriendList();
	},
	methods:{
		addFriend(){
			this.isAddingFriend = true;
		},
		submitAddFriend(){
			vm.addFriend(this.friendname,() => this.isAddingFriend = false);
		},
		deleteFriendConfirm(name){
			this.deleteConfirm = true;
			this.confirmUser = name;
		},
		deleteFriend(){
			vm.deleteFriend(this.confirmUser);
			this.deleteConfirm = false;
		},
		chat(name){
			this.isChatting = true;
			this.chatUser = name;
		},
	},
};

let Friend = {
	template:`
		<el-dialog
			v-model="show"
			:title="friend"
			fullscreen="true"
			center="true"
		>
			<el-row>
				<el-col :span="10">
					<el-input placeholder="说点什么吧..." />
				</el-cow>
				<el-cow :span="10">
					<el-button type="primary">发送</el-button>
				</el-col>
			</el-row>
			</template>
		</el-dialog>
	`,
	props:['friend','show'],
	data(){
		return {

		};
	},
	methods:{

	},
};

let components = {
	Home,
	Menu,
	Login,
	NotFound,
	Friends,
	Friend,
};

export default components;