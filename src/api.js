import "./style/index.scss";
import Components from "./components/index";
import directives from "./directives/index";
import utils from "./utils/index";

const install = function (Vue, options = {}) {
    if (install.installed && !options.reset) return;
    console.log(options);
    global.__VUE__ = Vue;

    const cssPrefix = options.cssPrefix || "due";
    const langPrefix = options.langPrefix || cssPrefix;
    const compPrefix = options.compPrefix || "";
    const directivePrefix = options.directPrefix == null ? compPrefix : directPrefix;
    const compPrefixUpper = compPrefix.toUpperCase();
    const langMap = options.langMap;
    const directiveList = options.directives === true ? Object.keys(directives) : options.directives;
    const directivesResult = {};
    if (Array.isArray(directiveList) && directiveList.length > 0) {
        directiveList.forEach((key) => {
            directivesResult[`${directivePrefix}${key}`] = directives[key];
        })
    }
    if (Vue.prototype) {
        Vue.prototype.__$cssPrefix__ = cssPrefix;
        Vue.prototype.__$langPrefix__ = langPrefix;
        if (langMap && typeof langMap === "object") {
            Vue.prototype.__$langMap__ = langMap;
        }
        Vue.prototype[`$${compPrefixUpper}VueWraper`] = Components.VueWraper;
        Vue.prototype[`$${compPrefixUpper}Modal`] = Components.Modal;
        Vue.prototype[`$${compPrefixUpper}LoadingBar`] = Components.LoadingBar;
        Vue.prototype[`$${compPrefixUpper}Notice`] = Components.Notice;
        Vue.prototype[`$${compPrefixUpper}Message`] = Components.Message;
        Vue.prototype[`$${compPrefixUpper}Loading`] = Components.Loading;
    } else {
        // vue 3.0 
        Object.defineProperty(Vue.__proto__, "__$cssPrefix__", {
            get() {
                return cssPrefix;
            },
        });
        Object.defineProperty(Vue.__proto__, "__$langPrefix__", {
            get() {
                return langPrefix;
            },
        });

        if (langMap && typeof langMap === "object") {
            Object.defineProperty(Vue.__proto__, "__$langMap__", {
                get() {
                    return langMap;
                },
            });
        }
        Object.defineProperties(Vue.__proto__, {
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
    }

    Vue.mixin({
        directives: directivesResult,
        computed: {
            _tobogPrefix_() {
                return `${this.__$cssPrefix__}-${(this.$options.name || "").toLowerCase()}`;
            },
        },
    });
    Object.keys(Components).forEach(function (key) {
        Vue.component(`${compPrefix}${key}`, Components[key]);
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
