import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Game from './views/Game.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ name: 'home', path: '/', component: Home },
		{ name: 'game', path: '/play', component: Game },
	],
})

export default router;
