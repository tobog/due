<template>
    <Component
        ref="dropBase"
        isOutRef
        isToggle
        :class="[_tobogPrefix_ + '-wrapper']"
        :dropClass="[_tobogPrefix_ + '-drop-wrapper', dropClass]"
        :is="showDrop ? 'DropBase' : 'section'"
        :data-vue-module="$options.name"
        :transfer="transfer"
        :dropStyle="dropStyle"
        :disabled="isReadonly"
        :reference="ready && showDrop ? $refs.inputBase.$refs.inputInner : null"
        v-model="visible"
        @scroll="handleScroll"
    >
        <InputBase
            ref="inputBase"
            :type="type"
            :class="[_tobogPrefix_]"
            :value="valueText"
            :valueData="model"
            :prefix="prefix"
            :suffix="suffix"
            :readonly="readonly"
            :name="name"
            :clearable="clearable"
            :disabled="disabled"
            :theme="theme"
            :multiple="multiple"
            :collapse="collapse"
            :active="visible"
            :showPassword="showPassword"
            :isInput="!isSelect || filterable"
            :maxLength="maxLength"
            @hook:created="ready = true"
            @on-focus="handleFocus"
            @on-input="handleInput"
            @on-clear="handleClear"
            @on-remove-item="handleClearTag"
            @on-change="handleChange"
            @on-icon-click="handleIconClick"
            @on-blur="handleBlur"
            @on-keydown="handleKeydown"
        >
            <template v-if="prepend" slot="prepend">
                <slot name="prepend"></slot>
            </template>
            <template v-if="append" slot="append">
                <slot name="append"></slot>
            </template>
            <template v-if="showPrefix" slot="prefix">
                <slot name="prefix"></slot>
            </template>
            <template v-if="showSuffix" slot="suffix">
                <slot name="suffix"></slot>
            </template>
        </InputBase>
        <template v-if="showDrop" slot="drop">
            <Options
                ref="options"
                :data="options"
                :value="model"
                :theme="theme"
                :multiple="multiple"
                :strict="strict"
                :keyModal="keyModal"
                @on-change="select"
            >
                <slot v-slot="opt" v-bind="opt"></slot>
            </Options>
        </template>
    </Component>
</template>

<script>
import DropBase from "../../base/dropBase";
import Options from "./list";
import InputBase from "../base";
import { throttle, validVal } from "../../../utils/tool";
import mixin from "../base/mixin";
export default {
    name: "Input",
    inheritAttrs: false,
    mixins: [mixin],
    components: {
        DropBase,
        InputBase,
        Options,
    },
    props: {
        // multipleKey: String,
        splitSymbol: {
            type: String,
            default: ",",
        },
        transfer: Boolean,
        multiple: Boolean,
        dropStyle: [Object, String],
        dropClass: [Object, String, Array],
        autoClose: {
            type: Boolean,
            default: true,
        },
        tip: {
            type: String,
            // default: "暂无数据",
            default: null,
        },
        keyModal: {
            type: Boolean,
            default: true,
        },
        filterable: Boolean,

        beforeInput: Function,
        strict: Boolean,
        options: Array,
        optCount: Number,
        maxLength: {
            default: 10,
        },
        showPassword: Boolean,
    },
    data() {
        return {
            model: "",
            visible: false,
            valueText: "",
            lastOptIndex: this.optCount || 15,
        };
    },
    created() {
        this.__updatedDrop = () => this.$refs.updatedDrop && this.$refs.dropBase.updatedDrop();
        this.searchMethod = throttle((val) => {
            this.$emit("on-search", val);
        }, 360);
    },
    mounted() {
        this.handleDispatch("on-change", this.model);
    },
    computed: {
        showDrop() {
            return this.$slots.default || this.hasValidOpts || this.hasOpts;
        },
        hasOpts() {
            return Array.isArray(this.options) || true;
        },
        isSelect() {
            return false;
        },
    },
    methods: {
        select(val, attach) {
            this.__attachData = attach;
            if (this.autoClose) this.visible = false;
            this.updateModel(val);
            this.$refs.inputBase.setInputFocus(); //有问题无法失去焦点
            this.showDrop && this.$refs.dropBase.cancelChange();
            this.$emit("on-change", this.model, this.__attachData);
        },
        handleFocus(event) {
            this.$nextTick(() => {
                this.$emit("on-focus", this.model, event);
            });
        },
        handleClear() {
            this.__attachData = "";
            this.updateModel(this.multiple ? [] : "");
            this.showDrop && this.$refs.dropBase.cancelChange();
            this.$emit("on-clear");
        },
        handleClearTag(index) {
            const data = [...this.model];
            const item = data.splice(index, 1);
            this.updateModel(data);
            this.showDrop && this.$refs.dropBase.cancelChange();
            this.$emit("on-remove-item", item, index);
        },

        handleChange(event) {
            if (this.type === "text") return;
            // 其他类型
            const dom = event.target;
            let value;
            if (this.type === "file") {
                const files = dom.files;
                value = this.multiple ? [...files] : files[0];
            } else {
                value = dom.value;
            }
            this.updateModel(value);
            this.$emit("on-change", this.model, this.__attachData);
        },
        async handleBeforeInput(val, event) {
            return typeof this.beforeInput === "function" ? await this.beforeInput(val, event) : val;
        },
        async handleInput(event) {
            let value = await this.handleBeforeInput(event.target.value, event);
            if (!this.multiple) {
                // input && no opts
                if (+this.maxLength > 0 && !this.hasOpts && !this.isSelect) {
                    this.valueText = event.target.value = `${value}`.slice(0, this.maxLength);
                } else {
                    this.valueText = value;
                }
            }
            this.__attachData = "";
            if (this.filterable && typeof this.$listeners["on-search"] === "function") {
                this.searchMethod(value, this.model, event);
                return;
            }
            if (this.hasOpts && this.$refs.options) {
                this.$refs.options.queryChange(value);
                this.$nextTick(() => {
                    this.__updatedDrop();
                });
                return;
            }
            this.__updatedDrop();
            if (this.isSelect) return;
            // 是input
            if (!this.multiple) {
                this.updateModel(this.valueText);
                return;
            }
            if (this.splitSymbol && value && event.type === "paste") {
                this.updateModel([...this.model, ...value.split(new RegExp("\\" + this.splitSymbol, "g"))]);
            }
        },
        handleBlur(event, inputDom) {
            if (!this.isReadonly) this.handleInputModel(inputDom.value);
            if (this.type === "number") {
                const value = this.handleRange(this.model);
                value !== void 0 && this.updateModel(value);
            }
            this.$nextTick(() => {
                this.type !== "file" && this.$emit("on-change", this.model, this.__attachData);
                this.$emit("on-blur", this.model, this.__attachData);
                this.__attachData = "";
                this.handleDispatch("on-validate", this.model, "blur");
            });
        },
        handleRange(val) {
            if (!validVal(val)) return;
            const { max, min } = this.$attrs;
            if ((min || min == "0") && val < min) return parseFloat(min);
            if ((max || max == "0") && val > max) return parseFloat(max);
        },

        handleInputModel(value) {
            // 焦点失去更新匹配值，无需点击
            const isValid = validVal(value);
            const bool = isValid && this.hasOpts && this.$refs.options && this.$refs.options.getMatchedOpt(value);
            if (bool || this.isSelect) return;
            if (isValid && this.multiple) {
                // input 多选
                this.updateModel(Array.isArray(this.model) ? [...this.model, value] : [value]);
                return;
            }

            if (!this.multiple) this.updateModel(value);
        },
        getValueText() {
            const getStricts = (item) => {
                if (item.strict !== void 0) return item.strict;
                return this.strict === false ? false : true;
            };
            const getOpt = (val) => {
                return this.options.find((item) => {
                    if (getStricts(item)) return item.value === val;
                    return item.value == val;
                });
            };
            if (this.multiple) {
                // 有问题
                return this.model.map((val) => {
                    let data = getOpt(val);
                    return (data && data.label) || val;
                });
            }
            const data = getOpt(this.model);
            const text = data && data.label;
            if (this.isSelect) return text == void 0 ? "" : text;
            return text == void 0 ? this.model : text;
        },

        updateModel(val) {
            if (val === this.model) return;
            this.model = val;
            this.valueText = this.getValueText();
            this.$emit("input", val);
            this.handleDispatch("on-change", val);
            this.multiple && (this.$refs.inputBase.getInputDom().value = "");
            this.__attachData = "";
        },
        //对外提供
        handleScroll(event) {
            if (this.__runOptIndex) return;
            if (event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight < 60) {
                this.__runOptIndex = true;
                this.lastOptIndex += 5;
            }
        },
        handleKeydown(event) {
            if (!this.keyModal) return;
            if (event.keyCode == 13 && !this.visible && (!this.multiple || (this.multiple && !event.target.value))) {
                this.visible = true;
                return;
            }
            // Esc slide-up
            // next
            if (this.$refs.options && this.visible) {
                this.$refs.options.handleKeydown(event);
                if (event.keyCode == 13) {
                    this.$nextTick(() => {
                        this.$emit("on-enter", this.model, event);
                        this.visible = false;
                    });
                }
            }
            if (event.keyCode == 27) {
                this.visible = false;
            }
        },
    },
    updated() {
        this.$nextTick(() => {
            this.__runOptIndex = false;
        });
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                this.$nextTick(() => {
                    if (this.multiple && !Array.isArray(val)) val = validVal(val) ? [val] : [];
                    this.updateModel(val);
                });
            },
        },
        visible(val) {
            if (val) {
                // this.optComponents.forEach((component) => {
                //     component.hidden = component.hover = false
                // })
                // this.handeOptQuery("")
            }

            this.$emit("on-visible-change", val);
        },
    },
};
</script>
