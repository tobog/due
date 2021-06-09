export { default as Color } from "./color"

export function oneOf(value, validList = []) {
    return validList.some((val) => {
        return val === value
    })
}

export function unit(val, unit = "px", radix = 1) {
    if (val === "" || val == null) return "";
    if (typeof unit === "number") {
        radix = unit
        unit = "px"
    }
    const size = parseFloat(val)
    if (val == size) return `${size * radix}${unit}`
    if (size !== size) {
        if (val === 'auto' || val === 'unset' || val === 'initial' || val === 'inherit') return val;
        return '';
    }
    if (radix == 1) return val
    return size * radix + `${val}`.substr(`${size}`.length)
}
export function isNumber(val) {
    return (!!val && val / 1 === val / 1) || val === 0
}
export function validVal(val) {
    //非'',null void 0,false,//true
    return !!val || val === 0
}
export function parseNumber(val) {
    val = parseFloat(val)
    return val === val ? val : 0
}

export function isParseNumber(val) {
    val = parseFloat(val)
    return val === val
}

export function typeOf(data) {
    const toString = Object.prototype.toString,
        map = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regExp",
            "[object Undefined]": "void 0",
            "[object Null]": "null",
            "[object Object]": "object",
            "[object File]": "file",
            "[object Argument]": "array",
        }
    const type = toString.call(data)
    return map[type] || type.replace(/\[+|\]+|s+/gi, "").toLowerCase()
}
//节流
export function throttle(fn, wait = 1200, immediate) {
    if (typeof fn !== "function") throw "argument[0] must be the function"
    const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === "function"
    let last = 0,
        timeout
    const throttle = function (...args) {
        if (useRAF) {
            window.cancelAnimationFrame(timeout)
            return (timeout = window.requestAnimationFrame(() => {
                fn.apply(this, args)
            }))
        }
        const now = Date.now()
        if (last == 0) {
            last = now
            if (immediate) {
                fn.apply(this, args)
                // return
            }
        }
        const remain = last + wait - now
        if (remain > 0) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                last = 0
                fn.apply(this, args)
                timeout = args = null
            }, remain + 10)
            return
        }
        last = now
        fn.apply(this, args)
    }
    throttle.cancel = function () {
        clearTimeout(timeout)
        window.cancelAnimationFrame(timeout)
        timeout = null
        last = 0
    }
    return throttle
}
// 防抖
export function debounce(fn, wait = 200, immediate) {
    if (typeof fn !== "function") throw "argument[0] must be the function"
    let timeout = null
    const debounce = function (...args) {
        clearTimeout(timeout)
        const context = this
        if (immediate && !timeout) fn.apply(context, args)
        timeout = setTimeout(function () {
            if (!immediate) fn.apply(context, args)
            timeout = null
        }, wait)
    }
    debounce.cancel = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debounce
}

export function deepCopy(data, callback, env = "JS") {
    if (typeof callback !== "function") {
        env = callback
        callback = function (key, val) {
            return val
        }
    }
    if (env === "JSON") return JSON.parse(JSON.stringify(data, callback))
    let target,
        type = typeOf(data)
    if (type === "array") {
        target = []
        data.forEach(function (val, index) {
            target.push(deepCopy(callback(index, val, this)))
        }, data)
    } else if (type === "object") {
        target = {}
        Object.keys(data).forEach(function (key) {
            target[key] = deepCopy(callback(key, this[key], this))
        }, data)
    } else {
        return callback(void 0, data)
    }
    return target
}

export function deepMerge(
    target,
    source,
    callback = function (val) {
        return val
    }
) {
    const targetType = typeOf(target),
        sourceType = typeOf(source)
    if (targetType === "object" && targetType === sourceType) {
        Reflect.ownKeys(source).forEach(function (key) {
            target[key] = deepMerge(target[key], this[key])
        }, source)
    } else if (targetType === "array" && targetType === sourceType) {
        source.forEach(function (val, index) {
            target[index] = deepMerge(target[index], val)
        })
    } else {
        return callback(source)
    }
    return target
}

export function firstUpperCase(str = "") {
    return str[0].toUpperCase() + str.toString().slice(1)
}

export function trim(str = "") {
    return str.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "")
}

export function handleStyle(style) {
    if (typeof style === "string") {
        let obj = {}
        style.split(";").forEach((item) => {
            let arr = item.split(":")
            obj[arr[0]] = arr[1]
        })
        return obj
    }
    return style
}


export function installConfig(Vue, options = {}) {
    const cssPrefix = options.cssPrefix || "due";
    const langPrefix = options.langPrefix || cssPrefix;
    const compPrefix = options.compPrefix || "";
    const directPrefix = options.directPrefix == null ? compPrefix : options.directPrefix;
    // const compPrefixUpper = compPrefix.toUpperCase();
    const langMap = options.langMap;
    const proto = Vue.prototype || Vue.__proto__; // vue 3.0 
    Object.defineProperty(proto, "__$cssPrefix__", {
        get() {
            return cssPrefix;
        },
    });
    Object.defineProperty(proto, "__$langPrefix__", {
        get() {
            return langPrefix;
        },
    });
    if (langMap && typeof langMap === "object") {
        Object.defineProperty(proto, "__$langMap__", {
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
    return {
        cssPrefix,
        langPrefix,
        compPrefix,
        directPrefix,
    }
}


export function componentInstall(Component, name) {
    Component.install = function (Vue, options) {
        if (Component.install.installed && !options.reset) return;
        Component.install.installed = true;
        if (!global.__VUE__) {
            global.__VUE__ = Vue;
        }
        const { compPrefix } = installConfig(Vue, options);
        if (Array.isArray(Component)) {
            Component.forEach(item => {
                Vue.component(`${compPrefix}${name || item.name}`, item);
            });
        } else {
            Vue.component(`${compPrefix}${name || Component.name}`, Component);
        }
    };
    return Component;
}
