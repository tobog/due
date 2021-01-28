<template>
    <form :data-vue-module="$options.name" :class="classes" @submit.prevent="submit">
        <slot></slot>
        <!-- 防止单个表单出现 enter 提交 -->
        <input type="hidden" />
    </form>
</template>

<script>
import {scrollIntoView} from "../../utils/dom"
export default {
    name: "Form",
    componentName: "Form",
    props: {
        width: [Number, String],
        rules: Object,
        labelWidth: [Number, String],
        inline: Boolean,
        labelAlign: String,
        labelVertical: String,
        reverse: Boolean,
        errorInview: {
            type: Boolean,
            default: true,
        },
        showMessage: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {}
    },
    created() {
        this.__FormItems = []
        this.$on("on-form-item-add", (item) => this.__FormItems.push(item))
        this.$on("on-form-item-remove", (item) => {
            const index = this.__FormItems.indexOf(item)
            if (index > -1) this.__FormItems.splice(index, 1)
        })
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-reverse`]: this.reverse,
                    [`${_tobogPrefix_}-inline`]: this.inline,
                },
            ]
        },
    },
    methods: {
        submit(...args) {
            this.$emit("on-submit", ...args)
        },
        validate(callback) {
            return new Promise((resolve, reject) => {
                let valid = true,
                    len = this.__FormItems.length,
                    count = 0,
                    firstError
                if (!len) return resolve(true)
                this.__FormItems.forEach((item) => {
                    item.validate(void 0, (errors) => {
                        const prevalid = valid
                        if (errors) valid = false
                        if (errors && !firstError) firstError = errors
                        if (this.errorInview && valid != prevalid) {
                            scrollIntoView(item.$el, {position: "center"})
                        }
                        if (++count === len) {
                            // all finish
                            typeof callback == "function" && callback(valid, firstError)
                            valid ? resolve(true) : reject(firstError)
                        }
                    })
                })
            })
        },
        async validateField(prop, cb) {
            const item = this.__FormItems.find((item) => item.prop === prop)
            if (!item) throw `[warn]:the prop of the FormItem Component must equals  ${prop} as child.prop!`
            return item.validate(void 0, cb)
        },
        async resetValidate() {
            this.__FormItems.forEach((item) => {
                item.resetValidate()
            })
        },
    },
}
</script>
