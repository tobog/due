export default class Json {
    constructor(elements, callback) {}
    static eval(key = "", source) {
        key = key.replace(/(\]\.)|(\]\[)/g, ".").split(/[\[\]\.]/g);
        if (key[key.length - 1] !== "") key.push("");
        let getKeyVal = function(key = [], source) {
            let value = source;
            for (let i = 0, len = key.length; i < len; i++) {
                let _key = key[i];
                if (_key === "") continue;
                if (_key === "_root") {
                    let index = key.lastIndexOf("");
                    let arr =
                        index > -1 ? key.slice(i + 1, index) : key.slice(i + 1);
                    _key = getKeyVal(arr, source);
                    i = index - 2;
                }
                value = value[_key];
                if (!(value instanceof Object) || value === null) return value;
            }
            return value;
        };
        return getKeyVal(key, source);
    }
    static stringify(data) {
        if (typeOf(data) !== "object") return;
        const arr = [];
        const converObj = function(obj, prefix) {
            const type = typeOf(obj);
            if (type === "object") {
                Object.keys(obj).forEach(function(key) {
                    converObj(this[key], prefix ? `${prefix}[${key}]` : key);
                }, obj);
            } else if (type === "array") {
                Object.keys(obj).forEach(function(key) {
                    converObj(this[key], prefix);
                }, obj);
            } else {
                if (obj === undefined || obj === null) obj = "";
                arr.push(`${prefix}=${obj}`);
            }
        };
        converObj(data);
        return arr.join("&");
    }
    static evalKeys(str, context) {
        context = context || this;
        if (!str || typeof str !== "string" || !context) return str;
        str = str.replace(/^\s+/g, "");
        str = str[0] === "[" ? `this${str}` : `this.${str}`;
        const reg = /\[[^\"\'\.\[\]]+/g;
        const template = str.replace(reg, function(match, reg, offset, str) {
            // console.log(...arguments);
            match = match.replace(/\s+/g, "");
            return `[this.${match.substring(1)}`;
        });
        // console.log(template);
        const evalfn = new Function("context", "{ return " + template + "}");
        try {
            return evalfn.call(context);
        } catch (error) {
            console.warn(error, str);
            return str;
        }
    }
}
