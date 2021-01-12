export default {
    inject: {
        $ConfigProvide: {
            from: "$ConfigProvide",
            default: "",
        },
    },
    props: {
        size: String, // small normal(default),medium,large
        theme: String,
    },
    methods: {
        getGlobalData(key, globalKey = key, defaultVal) {
            // console.log(this)
            // if (Array.isArray(key)){
            //     let value;
            //     key.some(i => {
            //         value = value ? value : this[i];
            //         return !!value;
            //     });
            //     if (value !== void 0) return value;
            // }
            if (defaultVal !== void 0) return defaultVal;
            if (this[key] !== void 0) return this[key];
            if (this.$ConfigProvide && this.$ConfigProvide[globalKey] !== void 0) return this.$ConfigProvide[globalKey];
            return this.$DUE && this.$DUE[globalKey];
        },
    },
};
