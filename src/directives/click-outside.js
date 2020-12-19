import { ClickOut } from '../utils/dom';
import { typeOf } from '../utils/tool'
export default {
    bind(el, { value }, vnode) {
        const callback = typeOf(value) === 'object' ? value.callback : value;
        const refs = (value && value.reference) ? [el, value.reference] : [el];
        el.__vueClickOutside = new ClickOut(refs, callback);
        el.__vueClickOutside.binding();
    },
    componentUpdated(el, { value }, vnode) {
        const refs = (value && value.reference) ? [el, value.reference] : [el];
        el.__vueClickOutside.update(refs);
    },
    unbind(el) {
        el.__vueClickOutside.destroy();
        el.__vueClickOutside = null;
    }
}

// export default directive;