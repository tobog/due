<template>
    <div :class="classes" :data-vue-module="$options.name" :style="getStyle">
        <div v-if="showLabel" ref="label" :style="labelStyles" :class="[_tobogPrefix_ + '-label']">
            <slot name="label">{{ label }}</slot>
        </div>
        <div :class="[_tobogPrefix_ + '-content']">
            <slot></slot>
            <div
                v-if="getShowMessage && (error || message || $slots.message)"
                :class="[_tobogPrefix_ + '-message-wrapper']"
            >
                <slot name="message">
                    <div :class="[_tobogPrefix_ + '-message']">{{ error || message }}</div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
import AsyncValidator from "async-validator"
import {findComponentUpward} from "../../../utils/findComponent"
import {debounce, unit, validVal} from "../../../utils/tool"
export default {
    name: "FormItem",
    componentName: "FormItem",
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
        reverse: Boolean,
        showMessage: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            error: "",
        }
    },
    created() {
        this.__Form = findComponentUpward(this, "Form") || {}
        this.__Form.$emit && this.__Form.$emit("on-form-item-add", this)
        if (this.prop) {
            this.__debounceValidator = debounce(this.validate)
            this.$on("on-validate", this.__debounceValidator)
            this.$on("on-change", this.handleChange)
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const vertical = this.vertical || this.__Form.labelVertical
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-required`]: this.isRequired,
                    [`${_tobogPrefix_}-vertical-${vertical}`]: !!vertical,
                    [`${_tobogPrefix_}-error`]: !!this.error,
                    [`${_tobogPrefix_}-reverse`]: this.reverse || this.__Form.reverse,
                    [`${_tobogPrefix_}-inline`]: this.inline || this.__Form.inline,
                    [`${_tobogPrefix_}-inline-label`]: validVal(this.getLabelWidth),
                },
            ]
        },
        getStyle() {
            if (!this.inline && !this.__Form.inline) return {}
            const width = validVal(this.width) ? this.width : this.__Form.width
            return validVal(width)
                ? {
                      width: unit(width),
                  }
                : {}
        },
        showLabel() {
            const width = this.getLabelWidth
            return width != "0" && width !== "0px" && (validVal(this.label) || !!this.$slots.label)
        },
        getLabelWidth() {
            return validVal(this.labelWidth) ? this.labelWidth : this.__Form.labelWidth
        },
        labelStyles() {
            let width = this.getLabelWidth,
                align = this.align || this.__Form.labelAlign,
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
            const formRules = this.__Form.rules || {}
            const rules = this.rules || formRules[this.prop] || formRules["*"] || []
            return rules instanceof Array ? rules : [rules]
        },
        getShowMessage() {
            return this.showMessage || this.__Form.showMessage
        },
    },
    methods: {
        handleChange(val) {
            this.__validate = true
            this.getValue(val)
        },
        getValue(val) {
            if (val === void 0) {
                if (this.__validVal === void 0 || !this.__validate) return (this.__validVal = this.value)
                return this.__validVal
            }
            return (this.__validVal = val)
        },
        validate(val, callback, trigger) {
            const prop = this.prop,
                iscb = typeof callback === "function"
            let rules = this.isRequired && this.getRules.length == 0 ? [{required: true}] : this.getRules
            if (!trigger && !iscb) {
                trigger = callback
                callback = null
            }
            if (trigger) {
                rules = rules.filter((rule) => !rule.trigger || rule.trigger === trigger)
            }
            if (!prop || (!this.__validate && this.__validVal === void 0) || !rules.length) {
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
        this.__Form.$emit && this.__Form.$emit("on-form-item-remove", this)
        this.__debounceValidator && this.__debounceValidator.cancel()
        this.__debounceValidator = null
    },
}
</script>
