import components from './components.js';

export default [
	{ path:'/',redirect:'/home' },
	{ path:'/home',component:components.Home },
	{ path:'/:path(.*)*',component:components.NotFound },
];