<template>
    <div :class="classes" @click.stop="select" :data-vue-module="$options.name">
        <slot :selected="selected" :theme="getTheme" :disabled="disabled">
            <Checkbox
                v-if="getCheckbox && getMultiple"
                readonly
                :class="[_tobogPrefix_ + '-checkbox']"
                :theme="getTheme"
                :value="selected"
                :disabled="disabled"
            ></Checkbox>
            {{ getText }}
            <Icons
                v-if="selected && !getCheckbox && getMultiple"
                type="ios-checkmark"
                :class="[_tobogPrefix_ + '-icon-selected']"
            ></Icons>
        </slot>
    </div>
</template>
<script>
import Icons from "../icons/index"
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
    },
    data() {
        return {}
    },
    created() {
        this.handleDispatch("on-init-none")
    },
    computed: {
        getTheme() {
            return this.theme || (this.__parentComponent__ && this.__parentComponent__.theme)
        },
        getText() {
            return this.label != void 0 ? this.label : this.value
        },
        getCheckbox() {
            return this.checkbox || (this.__parentComponent__ && this.__parentComponent__.checkbox)
        },
        getMultiple() {
            return this.multiple || (this.__parentComponent__ && this.__parentComponent__.multiple)
        },
        getSize() {
            return this.size || (this.__parentComponent__ && this.__parentComponent__.size)
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const size = this.getSize
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-has-checkbox`]: this.getCheckbox,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-multiple`]: this.getMultiple,
                    [`${_tobogPrefix_}-theme-${this.getTheme}`]: !!this.getTheme,
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                },
            ]
        },
    },
    methods: {
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
