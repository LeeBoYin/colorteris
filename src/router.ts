import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Play from './views/Play.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ name: 'home', path: '/', component: Home },
		{ name: 'play', path: '/play', component: Play },
	],
})

export default router;
