<template>
    <div :class="classes" :data-vue-module="$options.name" :tabindex="_uid" @click="toggle">
        <slot name="prefix"></slot>
        <slot name="content" :isChecked="isChecked">
            <span :class="[_tobogPrefix_ + '-inner']" :style="getSizeStyle"></span>
        </slot>
        <span v-if="!!$slots.default || getLabel" :class="[_tobogPrefix_ + '-label']">
            <slot>{{ getLabel }}</slot>
        </span>
        <input
            type="radio"
            ref="radio"
            style="display:none;"
            :class="[_tobogPrefix_ + '-input']"
            :disabled="getAttrs.disabled"
            :readonly="getAttrs.readonly"
            :name="getAttrs.name"
            :value="trueValue"
            v-model="model"
            v-bind="$attrs"
        />
    </div>
</template>

<script>
import emitter from "../../utils/emitter"
import { findComponentUpward } from "../../utils/findComponent"
import { unit, validVal } from "../../utils/tool"
export default {
    name: "Radio",
    inheritAttrs: false,
    mixins: [emitter],
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
        trueValue: {
            type: [String, Number, Boolean],
            default: true,
        },
        label: String,
        disabled: Boolean,
        readonly: Boolean,
        strict: Boolean,
        size: [String, Number],
        theme: String,
        border: Boolean,
    },
    data() {
        return {
            model: this.value,
        }
    },
    beforeCreate() {
        this.__RadioGroup = findComponentUpward(this, "RadioGroup")
    },
    created() {
        if (this.__RadioGroup) {
            this.model = this.__RadioGroup.model
        } else {
            this.handleDispatch("on-change", this.model)
        }
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (val === this.model || this.__RadioGroup) return
                this.model = val
            },
        },
        "__RadioGroup.model": {
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
                if (this.__RadioGroup) {
                    this.__RadioGroup.model = val
                    return
                }
                this.handleDispatch("on-change", val)
                this.handleDispatch("on-validate", val, "change")
            },
        },
    },
    computed: {
        getLabel() {
            return validVal(this.label) || (this.trueValue !== true && this.trueValue)
        },
        isChecked() {
            return this.getAttrs.strict ? this.model === this.trueValue : this.model == this.trueValue
        },
        getSizeStyle() {
            let size = this.getAttrs.size || 16,
                result
            switch (size) {
                case "small":
                    size = 14
                    break
                case "default":
                    size = 16
                    break
                case "large":
                    size = 18
                    break
                case "auto":
                    size = ""
                    break
            }
            result = unit(size, "px")
            return size
                ? {
                      width: result,
                      height: result,
                  }
                : {}
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.getAttrs.theme}`]: !!this.getAttrs.theme,
                    [`${_tobogPrefix_}-checked`]: this.isChecked,
                    [`${_tobogPrefix_}-readonly`]: this.getAttrs.readonly,
                    [`${_tobogPrefix_}-disabled`]: this.getAttrs.disabled,
                    [`${_tobogPrefix_}-border`]: this.getAttrs.border,
                },
            ]
        },
        getAttrs() {
            return {
                disabled: this.disabled || (this.__RadioGroup && this.__RadioGroup.disabled),
                strict: this.strict || (this.__RadioGroup && this.__RadioGroup.strict),
                theme: this.theme || (this.__RadioGroup && this.__RadioGroup.theme),
                readonly: this.readonly || (this.__RadioGroup && this.__RadioGroup.readonly),
                size: this.size || (this.__RadioGroup && this.__RadioGroup.size),
                name: this.name || (this.__RadioGroup && this.__RadioGroup.name),
                border: this.border || (this.__RadioGroup && this.__RadioGroup.border),
            }
        },
    },
    methods: {
        toggle() {
            if (this.getAttrs.disabled || this.getAttrs.readonly) return
            this.$refs.radio.click()
        },
        // handleChange() {
        //     this.$emit("on-change", this.model)
        //     this.handleDispatch("on-validate", this.model)
        // },
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
