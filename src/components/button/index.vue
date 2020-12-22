<template>
    <component
        :is="getTag"
        :data-vue-module="$options.name"
        :class="classes"
        :type="htmlType"
        :style="styles"
        @click="handleClick"
        v-on="getListeners"
        v-bind="$attrs"
    >
        <slot name="icon" v-if="$slots.icon || icon || loading">
            <Icons :type="icon || (loading && 'loading')"></Icons>
        </slot>
        <slot></slot>
    </component>
</template>
<script>
import Icons from "../icons/index"
import Color from "../../utils/color"
import {unit} from "../../utils/tool"
import globalMixin from "../../mixins/global"
export default {
    name: "Button",
    componentName: "Button",
    mixins: [globalMixin],
    inheritAttrs: false,
    components: {Icons},
    props: {
        size: [String, Number],
        theme: String,
        color: String,
        shape: String, //round ,circle,square
        icon: String,
        ghost: Boolean,
        long: Boolean,
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        type: String, //solid,dashed,text
        htmlType: {
            type: String,
            default: "button",
        },
    },
    computed: {
        getTag() {
            const {to, href, tag = "button"} = this.$attrs
            if (to) return this.$router ? "router-link" : "a"
            if (href) return "a"
            return tag
        },
        isOnly() {
            const hasIcon = this.$slots.icon || this.icon || this.loading
            return !!((hasIcon && !this.$slots.default) || (!hasIcon && this.$slots.default))
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-loading`]: this.icon === "loading" || this.loading,
                    [`${_tobogPrefix_}-theme-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-${this.shape}`]: !!this.shape,
                    [`${_tobogPrefix_}-type-${this.type}`]: this.type === "dashed" || this.type === "text",
                    [`${_tobogPrefix_}-size-${this.size}`]: !this.styles.lineHeight,
                    [`${_tobogPrefix_}-ghost`]: this.ghost,
                    [`${_tobogPrefix_}-long`]: this.long,
                    [`${_tobogPrefix_}-only`]: this.isOnly,
                    [`${_tobogPrefix_}-plain`]: this.plain,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-custome-color`]: !!this.styles.color,
                    [`${_tobogPrefix_}-custome-size`]: !!this.styles.lineHeight,
                },
            ]
        },
        getListeners() {
            const listeners = {...this.$listeners}
            delete listeners["click"]
            return listeners
        },
        styles() {
            const style = {},
                size = this.getGlobalData("size"),
                isNaN = parseInt(size)
            if (isNaN === isNaN) {
                style.lineHeight = unit(size)
                style.paddingLeft = style.paddingRight = style.fontSize = unit(size, "px", 0.5)
                if (this.shape === "circle") {
                    style.width = style.height = style.lineHeight
                    style.paddingLeft = style.paddingRight = 0
                }
            }
            if (this.color && Color.isColor(this.color)) {
                const data = new Color(this.color)
                const value = data.toCSS()
                if (this.ghost) {
                    style.backgroundColor = "transparent"
                    style.borderColor = style.color = value
                } else if (this.plain) {
                    style.backgroundColor = data.setAlpha(0.08).toCSS()
                    style.borderColor = style.color = value
                } else {
                    style.color = "#fff"
                    style.backgroundColor = style.borderColor = value
                }
            }
            return style
        },
    },
    methods: {
        async handleClick(e) {
            if (this.__runningClick) return
            const click = this.$listeners["click"]
            if (typeof click === "function") {
                try {
                    this.__runningClick = true
                    await click(e)
                } catch (err) {
                    console.error(err)
                } finally {
                    this.__runningClick = false
                }
            }
        },
    },
}
</script>
