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
            :showWordCount="showWordCount"
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
            <slot slot="prepend" name="prepend"></slot>
            <slot slot="append" name="append"></slot>
            <slot slot="prefix" name="prefix"></slot>
            <slot slot="suffix" name="suffix"></slot>
            <slot name="tags" slot-scope="data" v-bind="data"></slot>
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
                :reset="visible"
                :noDataText="noDataText"
                @on-change="select"
            >
                <slot slot-scope="opt" v-bind="opt"></slot>
            </Options>
        </template>
    </Component>
</template>

<script>
import DropBase from "../../base/dropBase"
import Options from "./list"
import InputBase from "../base"
import {throttle, validVal} from "../../../utils/tool"
import mixin from "../base/mixin"
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
        noDataText: String,
        keyModal: {
            type: Boolean,
            default: true,
        },
        filterable: Boolean,

        beforeInput: Function,
        strict: {
            type: Boolean,
            default: true,
        },
        options: Array,
        maxLength: {
            type: Number,
            default: 0,
        },
        showPassword: Boolean,
        showWordCount: Boolean
        // lock: Boolean, // 只允许增加，锁定默认值
    },
    data() {
        return {
            model: "",
            visible: false,
            valueText: "",
        }
    },
    created() {
        this.__updatedDrop = () => this.$refs.updatedDrop && this.$refs.dropBase.updatedDrop()
        this.searchMethod = throttle((val) => {
            this.$emit("on-search", val)
        }, 360)
    },
    mounted() {
        this.handleDispatch("on-change", this.model)
    },
    computed: {
        showDrop() {
            return this.$slots.default || this.hasOpts
        },
        hasOpts() {
            return Array.isArray(this.options)
        },
        isSelect() {
            return false
        },
    },
    methods: {
        select(val, attach, isCancel) {
            this.__attachData = attach
            if (this.autoClose) this.visible = false
            this.updateModel(val)
            if (!isCancel) {
                this.$refs.inputBase.setInputFocus() //有问题无法失去焦点
                this.showDrop && this.$refs.dropBase.cancelChange()
            }
            this.$emit("on-change", this.model, this.__attachData)
        },
        handleFocus(event) {
            this.$nextTick(() => {
                this.$emit("on-focus", this.model, event)
            })
        },
        handleClear() {
            this.__attachData = ""
            this.updateModel(this.multiple ? [] : "")
            this.showDrop && this.$refs.dropBase.cancelChange()
            this.$emit("on-clear")
        },
        handleClearTag(index) {
            const data = [...this.model]
            const item = data.splice(index, 1)
            this.updateModel(data)
            this.showDrop && this.$refs.dropBase.cancelChange()
            this.$emit("on-remove-item", item, index)
        },

        handleChange(event) {
            if (this.type === "text") return
            // 其他类型
            const dom = event.target
            let value
            if (this.type === "file") {
                const files = dom.files
                value = this.multiple ? [...files] : files[0]
            } else {
                value = dom.value
            }
            this.updateModel(value)
            this.$emit("on-change", this.model, this.__attachData)
        },
        async handleBeforeInput(val, event) {
            return typeof this.beforeInput === "function" ? await this.beforeInput(val, event) : val
        },
        async handleInput(event) {
            let value = await this.handleBeforeInput(event.target.value, event)
            this.__attachData = ""
            if (!this.multiple) {
                // input && no opts
                this.valueText =
                    this.maxLength > 0 && !this.filterable && (!this.type || this.type === "text")
                        ? (event.target.value = `${value}`.slice(0, this.maxLength))
                        : value
            }
            if (this.filterable && typeof this.$listeners["on-search"] === "function") {
                this.searchMethod(value, this.model, event)
                return
            }
            if (this.$refs.options) {
                this.$refs.options.queryChange(value)
            }
            this.$nextTick(this.__updatedDrop)
            if (this.isSelect) return
            // 是input
            if (!this.multiple) {
                this.updateModel(this.valueText)
                return
            }
            if (this.splitSymbol && value && event.type === "paste") {
                this.updateModel([...this.model, ...value.split(new RegExp("\\" + this.splitSymbol, "g"))])
            }
        },
        handleBlur(event, inputDom) {
            if (!this.isReadonly) this.handleInputModel(inputDom.value)
            if (this.type === "number") {
                const value = this.handleRange(this.model)
                value !== void 0 && this.updateModel(value)
            }
            this.$nextTick(() => {
                this.type !== "file" && this.$emit("on-change", this.model, this.__attachData)
                this.$emit("on-blur", this.model, this.__attachData)
                this.__attachData = ""
                this.handleDispatch("on-validate", this.model, "blur")
            })
        },
        handleRange(val) {
            if (!validVal(val)) return
            const {max, min} = this.$attrs
            if ((min || min == "0") && val < min) return parseFloat(min)
            if ((max || max == "0") && val > max) return parseFloat(max)
        },

        handleInputModel(value) {
            // 焦点失去更新匹配值，无需点击
            const isValid = validVal(value)
            // 无法失去焦点问题
            // 在 输入框有值是进行匹配
            const bool = isValid && this.$refs.options && this.$refs.options.getMatchedOpt(value, true)
            if (bool || this.isSelect) return
            if (isValid && this.multiple) {
                // input 多选
                this.updateModel(Array.isArray(this.model) ? [...this.model, value] : [value])
                return
            }

            if (!this.multiple) this.updateModel(value)
        },
        getValueText() {
            const getOpt = (val) => {
                return (
                    this.hasOpts &&
                    this.options.find((item) => {
                        return item.strict || this.strict ? item.value === val : item.value == val
                    })
                )
            }
            if (this.multiple) {
                // 有问题
                return this.model.map((val) => {
                    let data = getOpt(val)
                    return (data && data.label) || val
                })
            }
            const data = getOpt(this.model)
            const text = data ? data.label || data.value : void 0
            if (this.isSelect) return text == void 0 ? "" : text
            return text == void 0 ? this.model : text
        },

        updateModel(val) {
            if (val === this.model) return
            this.model = (this.multiple && this.maxLength > 0 && Array.isArray(val)) ? val.slice(0, this.maxLength) : val
            this.valueText = this.getValueText()
            this.$emit("input", this.model)
            this.handleDispatch("on-change", this.model,'change')
            this.multiple && (this.$refs.inputBase.getInputDom().value = "")
            this.__attachData = ""
        },
        handleKeydown(event) {
            if (!this.keyModal) return
            // 在无opt 下 自动添加
            if (event.keyCode == 13 && !this.showDrop && this.multiple && event.target.value) {
                this.updateModel(Array.isArray(this.model) ? [...this.model, event.target.value] : [event.target.value])
                return
            }
            if (
                event.keyCode == 13 &&
                !this.visible &&
                this.showDrop &&
                (!this.multiple || (this.multiple && !event.target.value))
            ) {
                this.visible = true
                return
            }

            // Esc slide-up
            // next
            if (this.$refs.options && this.visible) {
                this.$refs.options.handleKeydown(event)
                if (event.keyCode == 13) {
                    this.$nextTick(() => {
                        this.$emit("on-enter", this.model, event)
                        this.visible = false
                    })
                }
            }
            if (event.keyCode == 27) {
                this.visible = false
            }
        },
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                this.$nextTick(() => {
                    if (this.multiple && !Array.isArray(val)) val = validVal(val) ? [val] : []
                    this.updateModel(val)
                })
            },
        },
        visible(val) {
            this.$emit("on-visible-change", val)
        },
    },
}
</script>
