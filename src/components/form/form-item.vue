<template>
    <div :class="wrapClasses" :data-vue-module="$options.name" :style="getStyle">
        <div v-if="showLabel" ref="label" :style="labelStyles" :class="[_tobogPrefix_ + '-label']">
            <slot name="label">{{ label }}</slot>
        </div>
        <div :class="[_tobogPrefix_ + '-content']">
            <slot></slot>
            <div v-if="error || message" :class="[_tobogPrefix_ + '-message-wrapper']">
                <div :class="[_tobogPrefix_ + '-message']" v-html="error || message"></div>
            </div>
        </div>
    </div>
</template>

<script>
import AsyncValidator from "async-validator"
import { findComponentUpward } from "../../utils/findComponent"
import { debounce, unit, validVal } from "../../utils/tool"

export default {
    name: "FormItem",
    props: {
        width: [Number, String],
        prop: String,
        labelWidth: [Number, String],
        required: Boolean,
        rules: Array,
        message: String,
        label: String,
        inline: Boolean,
        align: String,
        vertical: String,
        value: Object,
        size: [Number, String],
        reverse: Boolean,
    },
    data() {
        return {
            error: "",
        }
    },
    created() {
        this.Form = findComponentUpward(this, "Forms") || {}
        this.Form.$emit && this.Form.$emit("on-form-item-add", this)
        if (this.prop) {
            this.__debounceValidator = debounce(this.validate)
            this.$on("on-validate", this.__debounceValidator)
            this.$on("on-change", this.handleChange)
        }
    },
    computed: {
        getStyle() {
            if (!(this.inline || this.Form.inline)) return {}
            const width = validVal(this.width) ? this.width : this.Form.width
            return validVal(width)
                ? {
                      width: unit(width),
                  }
                : {}
        },
        showLabel() {
            const width = this.getLabelWidth
            return width != "0" && (validVal(this.label) || !!this.$slots.label)
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-required`]: this.isRequired,
                    [`${_tobogPrefix_}-vertical-${this.vertical}`]: !!this.vertical,
                    [`${_tobogPrefix_}-error`]: !!this.error,
                    [`${_tobogPrefix_}-reverse`]: this.reverse || this.Form.reverse,
                    [`${_tobogPrefix_}-inline`]: this.inline || this.Form.inline,
                    [`${_tobogPrefix_}-inline-label`]: validVal(this.getLabelWidth),
                },
            ]
        },
        getLabelWidth() {
            const labelWidth = this.labelWidth
            return validVal(labelWidth) ? labelWidth : this.Form.labelWidth
        },
        labelStyles() {
            let width = this.getLabelWidth,
                align = this.align || this.Form.align,
                style =
                    align === "justify"
                        ? {
                              textAlignLast: "justify",
                          }
                        : {}

            if (width === "auto") {
                return {
                    textAlign: align || "right",
                    ...style,
                }
            }
            if (validVal(width)) {
                return {
                    width: unit(width),
                    textAlign: align || "right",
                    ...style,
                }
            }
            return {
                width: "100%",
                textAlign: align || "left",
                ...style,
            }
        },
        isRequired() {
            if (!this.prop) return false
            let isRequired = this.required
            if (!isRequired) {
                isRequired = this.getRules.some((rule) => {
                    return rule.required
                })
            }
            return isRequired
        },
        getRules() {
            const formRules = this.Form.rules || {}
            const rules = this.rules || formRules[this.prop] || formRules["*"] || []
            return rules instanceof Array ? rules : [rules]
        },
    },

    methods: {
        handleChange(val) {
            this.__validate__ = true
            this.getValue(val)
        },
        getValue(val) {
            if (val === void 0) {
                if (this.__validVal__ === void 0 || !this.__validate__) return (this.__validVal__ = this.value)
                return this.__validVal__
            }
            return (this.__validVal__ = val)
        },
        validate(val, callback, trigger) {
            const prop = this.prop,
                iscb = typeof callback === "function"
            let rules = this.isRequired && this.getRules.length == 0 ? [{ required: true }] : this.getRules
            if (!trigger && !iscb) {
                trigger = callback
                callback = null
            }
            if (trigger) {
                rules = rules.filter((rule) => !rule.trigger || rule.trigger === trigger)
            }
            if (!prop || (!this.__validate__ && this.__validVal__ === void 0) || !rules.length) {
                iscb && callback()
                return true
            }
            const validator = new AsyncValidator({
                [prop]: rules,
            })
            return validator.validate(
                {
                    [prop]: this.getValue(val),
                },
                (errors) => {
                    this.error = errors ? errors[0].message : null
                    iscb && callback(this.error)
                }
            )
        },
        resetValidate() {
            this.error = null
        },
    },
    beforeDestroy() {
        this.Form.$emit && this.Form.$emit("on-form-item-remove", this)
    },
}
</script>
