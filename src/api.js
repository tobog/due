import "./style/index.scss"
import Components from "./components/index"
import directives from "./directives/index"
import utils from "./utils/index"

const install = function(Vue, options = {}) {
    if (install.installed && !options.reset) return
    global.__VUE__ = Vue
    const cssPrefix = options.cssPrefix || "due"
    const langPrefix = options.langPrefix || cssPrefix
    const compPrefix = options.compPrefix || ""
    const compPrefixUpper = compPrefix.toUpperCase()
    const langMap = options.langMap
    Vue.prototype.__$cssPrefix__ = cssPrefix
    Vue.prototype.__$langPrefix__ = langPrefix
    if (langMap && typeof langMap === "object") Vue.prototype.__$langMap__ = langMap
    Vue.mixin({
        computed: {
            _tobogPrefix_() {
                return `${this.__$cssPrefix__}-${(this.$options.name || "").toLowerCase()}`
            },
        },
    })
    Object.keys(Components).forEach(function(key) {
        Vue.component(`${compPrefix}${key}`, Components[key])
    })
    Vue.prototype[`$${compPrefixUpper}VueWraper`] = Components.VueWraper
    Vue.prototype[`$${compPrefixUpper}Modal`] = Components.Modal
    Vue.prototype[`$${compPrefixUpper}LoadingBar`] = Components.LoadingBar
    Vue.prototype[`$${compPrefixUpper}Notice`] = Components.Notice
    Vue.prototype[`$${compPrefixUpper}Message`] = Components.Message
    Vue.prototype[`$${compPrefixUpper}Loading`] = Components.Loading
}

if (window !== void 0) {
    window.Vue && window.Vue.use(install)
} else if (typeof global !== void 0) {
    global.Vue && global.Vue.use(install)
}

export {install, directives, utils}
export default {
    ...Components,
    install,
    directives,
    utils,
}
