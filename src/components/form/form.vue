<template>
    <form :data-vue-module="$options.name" :class="classes" @submit.prevent="submit">
        <slot></slot>
        <!-- 防止单个表单出现 enter 提交 -->
        <input type="hidden" />
    </form>
</template>

<script>
import { scrollIntoView } from "../../utils/dom";
export default {
    name: "Forms",
    props: {
        width: [Number, String],
        rules: Object,
        labelWidth: [Number, String],
        inline: Boolean,
        errorInview: {
            type: Boolean,
            default: true,
        },
        // labelPosition: String, //left,right,top-left,top-right,
        size: [Number, String],
        reverse: Boolean,
    },
    data() {
        return {
            FormItems: [],
        };
    },
    created() {
        this.$on("on-form-item-add", (item) => this.FormItems.push(item));
        this.$on("on-form-item-remove", (item) => {
            const index = this.FormItems.indexOf(item);
            if (index > -1) this.FormItems.splice(index, 1);
        });
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-reverse`]: this.reverse,
                    [`${_tobogPrefix_}-inline`]: this.inline,
                },
            ];
        },
    },
    methods: {
        submit(...args) {
            this.$emit("on-submit", ...args);
        },
        validate(callback) {
            return new Promise((resolve) => {
                let valid = true,
                    len = this.FormItems.length,
                    count = 0;
                if (!len) return resolve(true);
                this.FormItems.forEach((item) => {
                    item.validate(void 0, (errors) => {
                        const prevalid = valid;
                        if (errors) valid = false;
                        if (this.errorInview && valid != prevalid) {
                            scrollIntoView(item.$el, { position: "center" });
                        }
                        if (++count === len) {
                            // all finish
                            resolve(valid);
                            typeof callback == "function" && callback(valid);
                        }
                    });
                });
            });
        },
        async validateField(prop, cb) {
            const item = this.FormItems.find((item) => item.prop === prop);
            if (!item) throw `[warn]:the prop of the FormItem Component must equals  ${prop} as child.prop!`;
            return item.validate(void 0, cb);
        },
        async resetValidate() {
            this.FormItems.forEach((item) => {
                item.resetValidate();
            });
        },
    },
};
</script>
