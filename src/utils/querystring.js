import { typeOf } from './tool'
export default class QueryString {
    static stringify(data, { sep = '&', eq = '=', callback, encode, maxKeys = 0, simple = true } = {}) {
        if (typeOf(encode) !== 'function') {
            encode = function (val) {
                return encodeURIComponent(val);
            }
        }
        const arr=(QueryString.serialize(...arguments)||[]).map(function(item){
            return item[0]+eq+ encode(item[1]);
        })
        return arr.join(sep);
    }
    static serialize(data, { callback, maxKeys = 0, simple = true } = {}){
        if (typeOf(data) !== 'object') return [];
        if (typeOf(callback) !== 'function') {
            callback = function (key, prefix, type) {
                if (simple && type === 'array') return prefix;
                if (!prefix) return key;
                return `${prefix}[${key}]`;
            }
        }
        const arr = [],
            iterator = function (obj, prefix, callback, deep=0) {
                const type = typeOf(obj); ++deep;
                if (maxKeys > 0 && deep > maxKeys) return;
                if (type === 'object' || type === 'array') {
                    Object.keys(obj).forEach(function (key) {
                        const prefixkey = callback.call(this, key, prefix, type);
                        if (prefixkey === undefined || prefixkey === false) return;
                        iterator(this[key], prefixkey, callback, deep);
                    }, obj);
                } else {
                    if (obj === undefined || obj === null) obj = '';
                    if (typeof obj === 'string') obj = obj.trim();
                    arr.push([prefix,obj]);
                }
            }
            iterator(data, undefined, callback);
        return arr;
    }
    static parse(data = "", { sep = '&', eq = '=' } = {}) {
        if (typeOf(data) !== 'string') return data;
        const source = {};
        data = decodeURIComponent(data).split(sep);
        data.forEach(function (str) {
            let [keys = '', val] = str.split(eq), obj = source;
            keys = keys.replace(/\](\[)?/g, '.').split(/[\[\]\.]/g).filter(function (key) {
                return !!key;
            });
            const length = keys.length - 1;
            keys.forEach(function (key, index) {
                if (length <= index) {
                    const value = obj[key];
                    if (value === undefined) {
                        obj[key] = val;
                    } else if (typeOf(value) === 'array') {
                        value.push(val);
                    } else {
                        obj[key] = [value, val];
                    }
                } else {
                    if (!obj[key]) {
                        obj[key] = {}
                    } else {
                        obj = obj[key];
                    }
                }
            })
        })
        return source;
    }
}