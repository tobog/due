
import Affix from "../utils/scroll-affix";
export default {
    inserted(el, { value,/* modifiers, arg*/ }) {
        el.__bindAffix = function (el, value = {}) {
            if (el.__vueAffix || !document) return;
            el.__vueAffix = new Affix({
                offsetTop: value.offsetTop,
                offsetBottom: value.offsetBottom,
                zIndex: value.zIndex
            }, value.callback);
            el.__bindAffix = null;
        }
        el.__bindAffix(el, value);
    },
    componentUpdated(el, { value = {} }) {
        !el.__vueAffix && el.__bindAffix(el, value);
    },
    unbind(el) {
        el.__vueAffix && el.__vueAffix.destroy();
        el.__vueAffix = el.__bindAffix = null;
    }
}

// export default directive;