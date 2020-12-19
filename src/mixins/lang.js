export default {
    methods: {
        langs(key, defaultVal, ...args) {
            if (typeof this.$t !== 'function') return defaultVal;
            key = `${this.__$langPrefix__}.${key}`;
            key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
            const value = this.$t(key, ...args);
            return key === value ? defaultVal : value;
        },
    },
}