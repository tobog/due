import { ScrollLoad } from '../utils/dom';
import { typeOf } from '../utils/tool'

export default {
    bind(el, { value }) {
        el.__bindClickOut = function (el, value = {}) {
            if (el.__vueScrollLoad || !document) return;
            const callback = typeOf(value) === 'object' ? value.callback : value;
            el.__vueScrollLoad = new ScrollLoad(el, value, callback);
            el.__bindClickOut = null;
        }
    },
    insert(el, { value }) {
        el.__bindClickOut(el, value);
    },
    componentUpdated(el, { value }) {
        !el.__vueScrollLoad && el.__bindClickOut(el, value);
    },
    unbind(el) {
        el.__vueScrollLoad && el.__vueScrollLoad.destroy();
        el.__vueScrollLoad = el.__bindClickOut = null;
    }
}

// export default directive;
