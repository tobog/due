
import Clipboard from '../utils/clipboard';
export default {
    bind(el, data) {
        el.__bindClipboard = function (el, { value = {}, modifiers }) {
            if (el.__vueClipboard || !document) return;
            if (typeof value === 'function') {
                value = {
                    success: value
                }
            } else {
                value = { ...value };
            }
            if (modifiers.copy) value.action = () => 'copy';
            if (modifiers.paste) value.action = () => 'paste';
            if (modifiers.cut) value.action = () => 'cut';
            el.__vueClipboard = new Clipboard(el, value);
            el.__bindClipboard = null;
        }
    },
    inserted(el, data) {
        el.__bindClipboard(el, data);
    },
    componentUpdated(el, data) {
        !el.__vueClipboard && el.__bindClipboard(el, data);
    },
    unbind(el) {
        el.__vueClipboard && el.__vueClipboard.destroy();
        el.__vueClipboard = el.__bindClipboard = null;
    }
}
