import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import ClientSimulator from "./views/ClientSimulator.vue"

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/main',
            name: 'main',
            component: Main
        }, {
            path: '/client',
            name: 'client',
            component: ClientSimulator
        }
    ]
})
