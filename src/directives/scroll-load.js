import { ScrollLoad } from '../utils/dom';
export default {
    bind(el, binding, vnode) {
        el.__vueScrollLoad = new ScrollLoad(el, binding.value);
    },
    inserted(el) {
        el.__vueScrollLoad.binding();
    },
    unbind(el) {
        el.__vueScrollLoad.destroy();
        el.__vueScrollLoad = null;
    }
}

// export default directive;