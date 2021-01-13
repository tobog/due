
import Popper from '../utils/popper';
export default {
    bind(el, { value,/* modifiers, arg*/ }) {
        el.__bindPopper = function (el, value = {}) {
            if (el.__vuePopper || !document) return;
            let { reference, options = {} } = value;
            options = { ...options };
            if (!options.trigger) options.trigger = 'other'
            el.__vuePopper = new Popper(reference, el, options);
            el.__bindPopper = null;
            if (options.always) {
                el.__vuePopper.toggle(true)
            }
        }
        el.__bindPopper(el, value);
    },
    componentUpdated(el, { value }) {
        if (el.__vuePopper) {
            let { reference, options = {} } = value || {};
            if (!reference || el.style.display === 'none') return;
            options = { ...options };
            if (!options.trigger) options.trigger = 'other'
            el.__vuePopper.update(reference, el, options);
            if (options.always) {
                el.__vuePopper.toggle(true)
            }
        } else {
            el.__bindPopper(el, value);
        }
    },
    unbind(el) {
        el.__vuePopper && el.__vuePopper.destroy();
        el.__vuePopper = el.__bindPopper = null;
    }
}

// export default directive;