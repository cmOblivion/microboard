import components from './components.js';

export default [
	{ path:'/',redirect:'/home' },
	{ path:'/home',component:components.Home },
	{ path:'/friends',component:components.Friends },
	{ path:'/friend/:name',component:components.Friend },
	{ path:'/:path(.*)*',component:components.NotFound },
];