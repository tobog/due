
import Popper from '../utils/popper';
export default {
    bind(el, { value,/* modifiers, arg*/ }, vnode, oldVnode) {
        const { reference, options = {} } = value;
        el.__vuePopper = new Popper(reference, el, options);
    },
    componentUpdated(el, { value }, vnode, oldVnode) {
        const { reference, options = {} } = value;
        if (!reference || el.style.display === 'none') return;
        el.__vuePopper.mounted(reference, el, options).update();
    },
    unbind(el) {
        el.__vuePopper.destroy();
        el.__vuePopper = null;
    }
}

// export default directive;