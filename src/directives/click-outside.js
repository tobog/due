import { ClickOut } from '../utils/dom';
import { typeOf } from '../utils/tool'
export default {
    inserted(el, { value }) {
        el.__bindClickOut = function (el, value = {}) {
            if (el.__vueClickOutside || !document) return;
            const callback = typeOf(value) === 'object' ? value.callback : value;
            const refs = (value && value.reference) ? [el, value.reference] : [el];
            el.__vueClickOutside = new ClickOut(refs, callback);
            el.__bindClickOut = null;
        }
        el.__bindClickOut(el, value);
    },
    componentUpdated(el, { value }) {
        !el.__vueClickOutside && el.__bindClickOut(el, value);
    },
    unbind(el) {
        el.__vueClickOutside && el.__vueClickOutside.destroy();
        el.__vueClickOutside = null;
    }
}

// export default directive;