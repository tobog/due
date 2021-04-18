<template>
    <div :class="classes" @click.stop="select" :data-vue-module="$options.name">
        <slot :selected="selected" :theme="getProp('theme')" :disabled="disabled">
            <span :class="[_tobogPrefix_ + '-text']">{{ getText }}</span>
            <Checkbox
                v-if="checkbox"
                readonly
                :class="[_tobogPrefix_ + '-checkbox']"
                :theme="getProp('theme')"
                :value="selected"
                :disabled="disabled"
            ></Checkbox>
            <Icons
                v-if="selected && !checkbox"
                type="ios-checkmark"
                :class="[_tobogPrefix_ + '-icon-selected']"
            ></Icons>
        </slot>
    </div>
</template>
<script>
import Icons from "../icons/src/index"
import Checkbox from "../checkbox/index"
import Emitter from "../../utils/emitter"
import {isParseNumber} from "../../utils/tool"

export default {
    name: "Option",
    componentName: "Option",
    mixins: [Emitter],
    components: {
        Icons,
        Checkbox,
    },
    props: {
        value: {
            type: [String, Number],
            required: true,
        },
        label: [String, Number],
        multiple: Boolean,
        disabled: Boolean,
        attach: Object,
        selected: Boolean,
        hover: Boolean,
        checkbox: Boolean,
        theme: String,
        size: String,
        wrapable: Boolean,
        reverse: Boolean,
    },
    data() {
        return {}
    },
    created() {
        this.handleDispatch("on-init-none")
    },
    computed: {
        getText() {
            return this.label != null ? this.label : this.value
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const theme = this.getProp('theme');
            const size = this.getProp('size');
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-ellipsis`]: !this.wrapable,
                    [`${_tobogPrefix_}-reverse`]: this.reverse,
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-has-checkbox`]: this.checkbox,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-multiple`]: this.getProp('multiple'),
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                },
            ]
        },
    },
    methods: {
        getProp(key){
            return this[key] || (this.__parentComponent__ && this.__parentComponent__[key])
        },
        select() {
            if (this.disabled) return
            this.handleDispatch("on-select", this.value, this.getText, this.attach)
            this.$emit("on-select", {
                value: this.value,
                label: this.getText,
                attach: this.attach,
                selected: this.selected,
            })
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch("Options", ...args)
            }
        },
    },
    watch: {
        hover: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.handleDispatch("on-option-change", "hover", this)
                }
            },
        },
    },
    beforeDestroy() {
        this.handleDispatch("on-option-change", "destroy", this)
    },
}
</script>
