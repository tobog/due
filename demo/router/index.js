import Vue from 'vue'
import Router from 'vue-router'
import initList from './routelist'
Vue.use(Router);

export default new Router({
    mode: "hash",
    routes: [{
        path: '/',
        component: (require) => import('../components/index'),
        children: initList('router'),
    }]
})