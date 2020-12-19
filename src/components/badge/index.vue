<template>
    <span :class="[_tobogPrefix_]" :data-vue-module="$options.name">
        <slot></slot>
        <span v-if="showLabel" :class="labelClasses" :style="labelStyle">
            <slot name="label">{{ format(label, overLabel) }}</slot>
            <span v-if="progress" :style="progressStyle" :class="[_tobogPrefix_ + '-progress']"></span>
        </span>
    </span>
</template>

<script>
import { parseNumber, unit, validVal } from '../../utils/tool';
export default {
    name: 'Badge',
    props: {
        label: Number,
        offset: Array,
        type: String, //success、primary、default、error、warning、info
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
                return parseNumber(label) >= parseNumber(overLabel) ? `${overLabel}+` : label;
            },
        },
    },
    computed: {
        labelClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-base`,
                {
                    [`${_tobogPrefix_}-label`]: this.label || this.$slots.label,
                    [`${_tobogPrefix_}-only`]: !this.$slots.default,
                    [`${_tobogPrefix_}-${this.type}`]: !!this.type,
                    // [`${_tobogPrefix_}-progress`]: this.progress,
                },
            ];
        },
        progressStyle() {
            const style = {};
            if (this.color) style.boxShadow = `0 0 10px 1px ${this.color}, inset 0 0 20px ${this.color}`;
            return style;
        },
        labelStyle() {
            const offset = this.offset;
            const style = {};
            if (this.color) style.backgroundColor = this.color;
            if (!Array.isArray(offset)) return style;
            if (validVal(offset[0])) style.top = unit(offset[0]);
            if (validVal(offset[1])) style.right = unit(offset[1]);
            return style;
        },
    },
};
</script>
