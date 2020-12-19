
import Popper from '../utils/popper';
export default {
    bind(el, { value,/* modifiers, arg*/ }) {
        el.__bindPopper = function (el, value = {}) {
            if (el.__vuePopper || !document) return;
            const { reference, options = {} } = value;
            el.__vuePopper = new Popper(reference, el, { ...options, trigger: 'other' });
            el.__bindPopper = null;
        }
        el.__bindPopper(el, value);
    },
    componentUpdated(el, { value }) {
        if (el.__vuePopper) {
            const { reference, options = {} } = value || {};
            if (!reference || el.style.display === 'none') return;
            el.__vuePopper.update(reference, el, { ...options, trigger: 'other' });
        } else {
            el.__bindPopper(el, value);
        }
    },
    unbind(el) {
        el.__vuePopper && el.__vuePopper.destroy();
        el.__vuePopper = null;
    }
}

// export default directive;