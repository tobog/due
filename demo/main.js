import Vue from "vue"
import API from "../src/api"
import router from "./router"
// import Highlight from "./template/highlight";
import mixin from "./mixin"
// Vue.use(Highlight);
Vue.use(API, {compPrefix: "v"})
Vue.mixin(mixin)
const vm = new Vue({
    el: "#app",
    router,
})
console.log("vm", vm)
