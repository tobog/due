import "./style/index.scss";
import Components from "./components/index";
import directives from "./directives/index";
import utils from "./utils/index";

const install = function(Vue, options = {}) {
    if (install.installed && !options.reset) return;
    console.log(options);
    global.__VUE__ = Vue;
    const cssPrefix = options.cssPrefix || "due";
    const langPrefix = options.langPrefix || cssPrefix;
    const compPrefix = options.compPrefix || "";
    const compPrefixUpper = compPrefix.toUpperCase();
    const langMap = options.langMap;
    const prototype = Vue.prototype || Vue.__proto__;
    Object.defineProperty(prototype, "__$cssPrefix__", {
        get() {
            return cssPrefix;
        },
    });
    Object.defineProperty(prototype, "__$langPrefix__", {
        get() {
            return langPrefix;
        },
    });

    if (langMap && typeof langMap === "object") {
        Object.defineProperty(prototype, "__$langMap__", {
            get() {
                return langMap;
            },
        });
    }
    Vue.mixin({
        computed: {
            _tobogPrefix_() {
                return `${this.__$cssPrefix__}-${(this.$options.name || "").toLowerCase()}`;
            },
        },
    });
    Object.keys(Components).forEach(function(key) {
        Vue.component(`${compPrefix}${key}`, Components[key]);
    });
    Object.defineProperties(prototype, {
        [`$${compPrefixUpper}VueWraper`]: {
            get() {
                return Components.VueWraper;
            },
        },
        [`$${compPrefixUpper}Modal`]: {
            get() {
                return Components.Modal;
            },
        },
        [`$${compPrefixUpper}LoadingBar`]: {
            get() {
                return Components.LoadingBar;
            },
        },
        [`$${compPrefixUpper}Notice`]: {
            get() {
                return Components.Notice;
            },
        },
        [`$${compPrefixUpper}Message`]: {
            get() {
                return Components.Message;
            },
        },
        [`$${compPrefixUpper}Loading`]: {
            get() {
                return Components.Loading;
            },
        },
    });
};

if (window !== void 0) {
    window.Vue && window.Vue.use(install);
} else if (typeof global !== void 0) {
    global.Vue && global.Vue.use(install);
}

export { install, directives, utils };
export default {
    ...Components,
    install,
    directives,
    utils,
};
