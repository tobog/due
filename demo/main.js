
import Vue from 'vue'
import API from '../src/api'
import router from './router/index'

Vue.use(API);
console.log(router)
const vm = new Vue({
    el: '#app',
    router,
});


