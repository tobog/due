
import Popper from '../utils/popper';
export default {
    bind(el, { value = {},/* modifiers, arg*/ }) {
        el.__bindPopper = function (el, value = {}) {
            if (el.__vuePopper || !document) return;
            let { reference, options = {} } = value;
            el.__vuePopper = new Popper(reference, el, { ...options });
            el.__bindPopper = null;
            if (options.always) {
                el.__vuePopper.toggle(true)
            }
        }
        if (value && value.reference) {
            el.__bindPopper(el, value);
        }
    },
    inserted(el, { value = {} }) {
        if (!el.__vuePopper && value && value.reference) {
            el.__bindPopper(el, value);
        }
    },
    componentUpdated(el, { value = {} }) {
        if (el.__vuePopper) {
            let { reference, options = {} } = value || {};
            if (!reference || el.style.display === 'none') return;
            el.__vuePopper.update(reference, el, { ...options });
            if (options.always) {
                el.__vuePopper.toggle(true)
            }
        } else if (value && value.reference) {
            el.__bindPopper(el, value);
        }
    },
    unbind(el, { value }) {
        el.__vuePopper && el.__vuePopper.destroy();
        el.__vuePopper = el.__bindPopper = null;
    }
}

// export default directive;