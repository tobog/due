<template>
    <div v-show="!hidden" :class="classes" @click.stop="select" @mousedown.prevent :data-vue-module="$options.name">
        <span ref="text">
            <slot>{{ getText }}</slot>
        </span>
        <slot name="selected" :selected="selected">
            <Icons v-if="multiple && selected" type="ios-checkmark" :class="[_tobogPrefix_ + '-icon-selected']"></Icons>
        </slot>
    </div>
</template>
<script>
import Icons from "../icons/index"
import Emitter from "../../utils/emitter"
// import {debounce} from "../../utils/tool"
export default {
    inheritAttrs: false,
    name: "Option",
    mixins: [Emitter],
    components: {
        Icons,
    },
    props: {
        value: {
            type: [String, Number],
            required: true,
        },
        label: {
            type: [String, Number],
            default: void 0,
        },
        disabled: Boolean,
        strict: {
            type: Boolean,
            default: void 0,
        },
        theme: String,
        attach: {},
    },
    data() {
        return {
            selected: false,
            hidden: false, // for search
            hover: false,
        }
    },
    created() {
        this.$on("on-selected", this.handleHighlight)
        this.$on("on-query-option", this.queryChange)
        this.handleDispatch("on-option-change", "created", this)
    },
    computed: {
        getTheme() {
            return this.theme || (this.__parentComponent__ || {}).theme
        },
        getText() {
            return this.label !== void 0 ? this.label : this.value
        },
        multiple() {
            return this.__parentComponent__ && this.__parentComponent__.multiple
        },
        stricts() {
            if (this.strict !== void 0) return this.strict
            return this.__parentComponent__ && this.__parentComponent__.strict === false ? false : true
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-multiple-selected`]: this.multiple && this.selected,
                    [`${_tobogPrefix_}-${this.getTheme}`]: !!this.getTheme,
                },
            ]
        },
    },
    methods: {
        text() {
            const text = this.label !== void 0 ? this.label : (this.$refs.text || {}).textContent || this.value
            return `${text}`.trim()
        },
        select() {
            this.hover = false
            if (this.disabled) return
            const text = this.text(),
                attach = this.attach === void 0 ? {label: this.label, text} : this.attach
            this.handleDispatch("on-select", this.value, text, attach)
            this.handleDispatch("on-attach", attach, this.value, text)
        },
        queryChange(val = "", isInputSearch) {
            if (val === "" || this.selected) return (this.hidden = false)
            this.hover = false
            const parsedQuery = `${val}`
                .replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function(match, reg, offset, str) {
                    if (reg === "\\") return "\\\\"
                    return reg
                })
                .trim()
            try {
                const text = this.text(),
                    match = text.indexOf(val) > -1
                this.hover = text === val
                if (isInputSearch) this.hidden = match ? false : !new RegExp(parsedQuery, "ig").test(text)
            } catch (error) {
                console.error(error)
            }
            this.$nextTick(() => {
                this.handleDispatch("on-updated", true)
            })
        },
        handleHighlight(value = "") {
            const isArray = Array.isArray(value) && this.multiple
            if (isArray) {
                this.selected = this.stricts
                    ? value.indexOf(this.value) > -1
                    : value.some((val) => {
                          return this.value == val
                      })
            } else {
                this.selected = this.stricts ? this.value === value : this.value == value
            }
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch(["Input", "Select"], ...args)
            }
        },
    },
    watch: {
        value: {
            deep: true,
            handler() {
                this.handleDispatch("on-option-change", "change", this)
            },
        },
    },
    beforeDestroy() {
        this.handleDispatch("on-option-change", "destroy", this)
        // this.__queryChange && this.__queryChange.cancel()
        // this.__queryChange = null
    },
}
</script>
