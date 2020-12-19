export default {
    inject: {
        $ConfigProvide: {
            from: "$ConfigProvide",
            default: "",
        },
    },
    props: {
        size: String, // small normal(default),midiue,large
        theme: String,
    },
    methods: {
        getGlobalData(key, globalKey = key) {
            // console.log(this)
            if (this[key] !== void 0) return this[key];
            if (this.$ConfigProvide && this.$ConfigProvide[globalKey] !== void 0)
                return this.$ConfigProvide[globalKey];
            return this.$DUE && this.$DUE[globalKey];
        },
    },
};