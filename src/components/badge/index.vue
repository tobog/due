<template>
    <span :class="classes" :data-vue-module="$options.name">
        <slot></slot>
        <span v-if="showLabel" :class="labelClasses" :style="labelStyle">
            <slot name="label">{{ format(label, overLabel) }}</slot>
            <span v-if="progress" :style="progressStyle" :class="[_tobogPrefix_ + '-progress']"></span>
        </span>
    </span>
</template>

<script>
import {parseNumber, unit, validVal} from "../../utils/tool"
import globalMixin from "../../mixins/global"
export default {
    name: "Badge",
    componentName: "Badge",
    mixins: [globalMixin],
    props: {
        label: Number,
        offset: Array,
        theme: String, //success、primary、default、error、warning、info
        progress: Boolean,
        color: String,
        overLabel: {
            type: Number,
            default: 99,
        },
        showLabel: {
            type: Boolean,
            default: true,
        },
        format: {
            type: Function,
            default(label, overLabel) {
                return parseNumber(label) >= parseNumber(overLabel) ? `${overLabel}+` : label
            },
        },
        size: String,
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const size = this.getGlobalData("size")
            const theme = this.getGlobalData("theme")
            return [
                _tobogPrefix_,

                {
                    [`${_tobogPrefix_}-size-${size}`]: size,
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                },
            ]
        },
        labelClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-inner`,
                {
                    [`${_tobogPrefix_}-label`]: this.label || this.$slots.label,
                    [`${_tobogPrefix_}-only`]: !this.$slots.default,
                },
            ]
        },
        progressStyle() {
            const style = {}
            if (this.color) style.boxShadow = `0 0 10px 1px ${this.color}, inset 0 0 20px ${this.color}`
            return style
        },
        labelStyle() {
            const offset = this.offset
            const style = {}
            if (this.color) style.backgroundColor = this.color
            if (!Array.isArray(offset)) return style
            if (validVal(offset[0])) style.top = unit(offset[0])
            if (validVal(offset[1])) style.right = unit(offset[1])
            return style
        },
    },
}
</script>
