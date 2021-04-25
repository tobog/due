<template>
    <component
        :is="getTag"
        :data-vue-module="$options.name"
        :class="classes"
        :type="type"
        :style="getStyles"
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
import Icons from "../../icons/src/index";
import Color from "../../../utils/color";
import { unit, isParseNumber } from "../../../utils/tool";
import globalMixin from "../../../mixins/global";
export default {
    name: "Button",
    componentName: "Button",
    mixins: [globalMixin],
    inheritAttrs: false,
    components: { Icons },
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
        borderType: String, //solid,dashed,text
        type: {
            type: String,
            default: "button",
        },
    },
    computed: {
        getTag() {
            const { to, href, tag = "button" } = this.$attrs;
            if (to) return this.$router ? "router-link" : "a";
            if (href) return "a";
            return tag;
        },
        isOnly() {
            const hasIcon = this.$slots.icon || this.icon || this.loading;
            return !!((hasIcon && !this.$slots.default) || (!hasIcon && this.$slots.default));
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size"),
                theme = this.getGlobalData("theme");
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-loading`]: this.icon === "loading" || this.loading,
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-${this.shape}`]: !!this.shape,
                    [`${_tobogPrefix_}-border-${this.borderType}`]:
                        this.borderType === "dashed" || this.borderType === "text",
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                    [`${_tobogPrefix_}-ghost`]: this.ghost,
                    [`${_tobogPrefix_}-long`]: this.long,
                    [`${_tobogPrefix_}-only`]: this.isOnly,
                    [`${_tobogPrefix_}-plain`]: this.plain,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-custome-color`]: !!this.getStyles.color,
                    [`${_tobogPrefix_}-custome-size`]: size && isParseNumber(size),
                },
            ];
        },
        getListeners() {
            const listeners = { ...this.$listeners };
            delete listeners["click"];
            return listeners;
        },
        getStyles() {
            const style = {},
                size = this.getGlobalData("size");
            if (isParseNumber(size)) {
                style.lineHeight = unit(size);
                style.paddingLeft = style.paddingRight = style.fontSize = unit(size, "px", 0.5);
                if (this.shape === "circle") {
                    style.width = style.height = style.lineHeight;
                    style.paddingLeft = style.paddingRight = 0;
                }
            }
            if (this.color && Color.isColor(this.color)) {
                if (this.ghost) {
                    style.backgroundColor = "transparent";
                    style.borderColor = style.color = this.color;
                } else if (this.plain) {
                    const data = new Color(this.color);
                    style.backgroundColor = data.setAlpha(0.08).toCSS();
                    style.borderColor = style.color = this.color;
                } else {
                    style.color = "#fff";
                    style.backgroundColor = style.borderColor = this.color;
                }
            }
            return style;
        },
    },
    methods: {
        async handleClick(e) {
            if (this.__runningClick) return;
            const click = this.$listeners["click"];
            if (typeof click === "function") {
                this.__runningClick = true;
                try {
                    await click(e);
                } catch (err) {
                    console.error(err);
                }
                this.__runningClick = false;
            }
        },
    },
};
</script>
