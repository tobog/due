<template>
    <div :class="classes" :data-vue-module="$options.name" :tabindex="_uid">
        <slot></slot>
        <template v-if="hasOpts">
            <Radio
                v-for="opt of options"
                :key="opt.value"
                :trueValue="opt.value"
                :label="opt.label"
                :v-bind="opt"
            ></Radio>
        </template>
    </div>
</template>

<script>
import emitter from "../../utils/emitter"
import Radio from "./index"
export default {
    name: "RadioGroup",
    inheritAttrs: false,
    mixins: [emitter],
    components: {
        Radio,
    },
    model: {
        prop: "value",
        event: "on-change",
    },
    props: {
        name: String,
        value: {
            type: [String, Number, Boolean],
            default: false,
        },
        disabled: Boolean,
        readonly: Boolean,
        strict: Boolean,
        size: [String, Number],
        theme: String,
        options: Array,
        border: Boolean, // button,
        compact: Boolean,
    },
    data() {
        return {
            model: this.value,
        }
    },
    created() {
        this.handleDispatch("on-change", this.model)
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (val === this.model) return
                this.model = val
            },
        },
        model: {
            deep: true,
            handler(val) {
                this.$emit("on-change", val)
                this.handleDispatch("on-change", val)
                this.handleDispatch("on-validate", val, "change")
            },
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-border`]: this.border,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-compact`]: this.compact,
                },
            ]
        },
        hasOpts() {
            return Array.isArray(this.options) && this.options.length > 0
        },
    },
    methods: {
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch("FormItem", ...args)
            }
        },
    },
}
</script>
