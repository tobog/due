<template>
    <form :data-vue-module="$options.name" :class="classes" @submit.prevent="submit" v-bind="$attrs">
        <slot></slot>
        <!-- 防止单个表单出现 enter 提交 -->
        <input type="hidden" />
    </form>
</template>

<script>
import {scrollIntoView} from "../../../utils/dom"
import {debounce, validVal} from "../../../utils/tool"
export default {
    name: "Form",
    componentName: "Form",
    props: {
        width: [Number, String],
        rules: Object,
        labelWidth: [Number, String], // autoALign, 自动宽度对齐
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
        return {

        }
    },
    created() {
        // 动态计算
        this._calcJustifyLabel = debounce(() => {
            let size = 0,
                isJustify = this.labelWidth === "autoAlign"
            if (!this._mounted || !isJustify) return

            this.__FormItems.forEach((item) => {
                const dom =
                    isJustify &&
                    !validVal(item.labelWidth) &&
                    item.$el.querySelector(`.${this._tobogPrefix_}item-label-placeholder`)
                if (dom) {
                    size = Math.max(size, dom.offsetWidth)
                }
            })
            this.__FormItems.forEach((item) => {
                const dom =
                    isJustify &&
                    !validVal(item.labelWidth) &&
                    item.$el.querySelector(`.${this._tobogPrefix_}item-label`)
                if (dom) {
                    dom.style.width = size + "px"
                }
            })
        }, 30)
        this.__FormItems = []
        this.$on("on-form-item-add", (item) => {
            this.__FormItems.push(item)
            this._calcJustifyLabel && this._calcJustifyLabel()
        })
        this.$on("on-form-item-remove", (item) => {
            const index = this.__FormItems.indexOf(item)
            if (index > -1) this.__FormItems.splice(index, 1)
            this._calcJustifyLabel && this._calcJustifyLabel()
        })
    },
    mounted() {
        this._mounted = true
        this._calcJustifyLabel()
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
    watch: {
        labelWidth() {
            this._calcJustifyLabel()
        },
    },
    beforeDestroy() {
        this._calcJustifyLabel && this._calcJustifyLabel.cancel()
        this._calcJustifyLabel = null
    },
}
</script>
