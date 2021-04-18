<template>
    <div
        :class="classes"
        :data-vue-module="$options.name"
        :tabindex="_uid"
        :style="getBorderStyle"
        @click="toggle"
        @keydown.enter="toggle"
    >
        <slot name="prefix"></slot>
        <slot name="content" :checked="isChecked">
            <span :class="[_tobogPrefix_ + '-inner']" :style="getInnerStyle">
                <template v-if="!radio">
                    <Icons v-if="indeterminate" type="remove" center />
                    <Icons v-else :type="trueIcon || 'checkmark'" center />
                </template>
            </span>
        </slot>
        <span v-if="$slots.default || showLabel" :class="[_tobogPrefix_ + '-label']">
            <slot>{{ label }}</slot>
        </span>
        <input
            ref="input"
            type="checkbox"
            :value="trueValue"
            :true-value="trueValue"
            :false-value="falseValue"
            :readonly="readonly"
            :disabled="disabled"
            :class="[_tobogPrefix_ + '-input']"
            :name="name"
            @click.stop
            @change="handleChange"
            v-model="model"
        />
    </div>
</template>

<script>
import emitter from "../../utils/emitter";
import Icons from "../icons/src/index";
import Color from "../../utils/color";
import { findComponentUpward } from "../../utils/findComponent";
import { unit, validVal } from "../../utils/tool";
import globalMixin from "../../mixins/global";
export default {
    name: "CheckBox",
    componentName: "CheckBox",
    components: { Icons },
    mixins: [emitter, globalMixin],
    model: {
        prop: "value",
        event: '"on-change',
    },
    props: {
        name: String,
        label: String,
        value: {
            type: [String, Number, Boolean, Array],
            default: false,
        },
        trueValue: {
            type: [String, Number, Boolean],
            default: true,
        },
        falseValue: {
            type: [String, Number, Boolean],
            default: void 0,
        },
        indeterminate: Boolean,
        disabled: Boolean,
        border: Boolean,
        readonly: Boolean,
        strict: Boolean,
        size: [String, Number],
        radio: Boolean,
        reverse: Boolean,
        ghost: Boolean,
        theme: String,
        trueIcon: String,
        // min: [Number, String], // 仅是组合
        // max: [Number, String],
    },
    beforeCreate() {
        this._checkBoxGroup_ = findComponentUpward(this, "CheckBoxGroup");
    },
    data() {
        return {
            model: this.falseValue === void 0 ? this.value : Array.isArray(this.value) ? `${this.value}` : this.value,
        };
    },
    created() {
        this.handleDispatch("on-change", this.model);
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (val === this.model) return;
                this.model = val;
            },
        },
        model: {
            deep: true,
            handler(val) {
                this.handleGroupModel();
                this.$emit("on-change", val);
                this.handleDispatch("on-change", val);
                this.handleDispatch("on-validate", val, "change");
            },
        },
        "_checkBoxGroup_.model": {
            deep: true,
            handler() {
                this.handleGroupModel(true);
            },
        },
    },
    computed: {
        showLabel() {
            return validVal(this.label);
        },
        getBorderStyle() {
            let style = {},
                color = this.getGlobalData(
                    "theme",
                    "theme",
                    this.theme || (this._checkBoxGroup_ && this._checkBoxGroup_.theme)
                );
            if (this.border || ((this.indeterminate || this.isChecked) && Color.isColor(color))) {
                const data = new Color(color);
                const value = data.toCSS();
                style.borderColor = value;
            }
            return style;
        },
        getInnerStyle() {
            let style = {},
                color = this.getGlobalData(
                    "theme",
                    "theme",
                    this.theme || (this._checkBoxGroup_ && this._checkBoxGroup_.theme)
                ),
                size = this.getGlobalData(
                    "size",
                    "size",
                    this.size || (this._checkBoxGroup_ && this._checkBoxGroup_.size)
                );

            if (parseInt(size) === parseInt(size)) {
                style.width = style.height = unit(size);
                style.fontSize = unit(size, "px", 0.9);
            }
            if ((this.indeterminate || this.isChecked) && Color.isColor(color)) {
                const data = new Color(color);
                const value = data.toCSS();
                if (this.ghost) {
                    style.color = value;
                } else {
                    style.backgroundColor = style.borderColor = value;
                }
            }
            return style;
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            const theme = this.getGlobalData(
                "theme",
                "theme",
                this.theme || (this._checkBoxGroup_ && this._checkBoxGroup_.theme)
            );
            const size = this.getGlobalData(
                "size",
                "size",
                this.size || (this._checkBoxGroup_ && this._checkBoxGroup_.size)
            );
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-radio`]: this.radio,
                    [`${_tobogPrefix_}-border`]: this.border,
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-checked`]: this.isChecked,
                    [`${_tobogPrefix_}-indeterminate`]: this.indeterminate,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-ghost`]: this.ghost,
                    [`${_tobogPrefix_}-size-${size}`]: !!size,
                },
            ];
        },
        isChecked() {
            const val = this.model,
                trueValue = this.trueValue,
                bool = Array.isArray(val);
            let checked;
            if (this.strict) {
                checked = bool ? val.indexOf(trueValue) > -1 : val === trueValue;
            } else {
                checked = bool
                    ? val.some((item) => {
                          return item == trueValue;
                      })
                    : val == trueValue;
            }
            return this.reverse ? !checked : checked;
        },
    },
    methods: {
        toggle() {
            if (this.disabled || this.readonly || (this._checkBoxGroup_ && this._checkBoxGroup_.readonly)) return;
            this.$refs.input.click();
        },
        handleChange(event) {
            this.$emit("on-change", this.model, event);
            this.handleDispatch("on-validate", this.model, "change");
            this._checkBoxGroup_ && this._checkBoxGroup_.handleChange(event);
        },
        handleGroupModel(isToModel) {
            const groupModel = this._checkBoxGroup_ && this._checkBoxGroup_.model,
                val = this.model,
                trueValue = this.trueValue,
                bool = Array.isArray(val);
            let checkIndex, groupCheckIndex;
            if (!Array.isArray(groupModel)) return;
            if (this.strict) {
                checkIndex = bool ? val.indexOf(trueValue) : val === trueValue ? 0 : -1;
                groupCheckIndex = groupModel.indexOf(trueValue);
            } else {
                checkIndex = bool
                    ? val.findIndex((item) => {
                          return item == trueValue;
                      })
                    : val === trueValue
                    ? 0
                    : -1;
                groupCheckIndex = groupModel.findIndex((item) => {
                    return item == trueValue;
                });
            }
            if (isToModel) {
                if (checkIndex > -1 && groupCheckIndex === -1) {
                    if (bool) {
                        this.model.splice(checkIndex, 1);
                    } else {
                        this.model = null;
                    }
                }
                if (checkIndex === -1 && groupCheckIndex > -1) {
                    if (bool) {
                        this.model.push(trueValue);
                    } else {
                        this.model = trueValue;
                    }
                }
            } else {
                if (checkIndex > -1 && groupCheckIndex === -1) {
                    this._checkBoxGroup_ && this._checkBoxGroup_.handleModel(true, trueValue);
                }
                if (checkIndex === -1 && groupCheckIndex > -1) {
                    this._checkBoxGroup_ && this._checkBoxGroup_.handleModel(false, groupCheckIndex);
                }
            }
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args);
            } else {
                this.__parentComponent__ = this.dispatch("FormItem", ...args);
            }
        },
    },
};
</script>
