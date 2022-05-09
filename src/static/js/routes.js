import components from './components.js';

export default [
	{ path:'/',redirect:'/home' },
	{ path:'/home',component:components.Home },
	{ path:'/friends',component:components.Friends },
	{ path:'/:path(.*)*',component:components.NotFound },
];