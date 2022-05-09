// 首页组件
let Home = {
	template:`
		<el-button type="primary">Hi!</el-button>
	`,
};

// 菜单组件
let Menu = {
	data(){
		return {
			active:'/',
		}
	},
	template:`
		<h3 id="menu-title">!Microboard!</h3>
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
			<el-submenu>
			</el-submenu>
		</el-menu>
	`,
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
				});
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

let components = {
	Home,
	Menu,
	Login,
};

export default components;