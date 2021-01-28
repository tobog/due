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
            :max="max"
            @hook:created="ready = true"
            @on-focus="handleFocus"
            @on-input="handleInput"
            @on-keydown="handleKeydown"
            @on-clear="handleClear"
            @on-remove-item="handleClearTag"
            @on-change="handleChange"
            @on-icon-click="handleIconClick"
            @on-blur="handleBlur"
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
            <slot>
                <div v-if="hasOpts">
                    <Option v-for="item in getInOpts" :key="item.value" v-bind="item"></Option>
                </div>
            </slot>
            <div v-if="hasValidOpts" :class="[_tobogPrefix_ + '-tip']">
                <slot name="tip">{{ getOptTip }}</slot>
            </div>
        </template>
    </Component>
</template>

<script>
import DropBase from "../base/dropBase"
import InputBase from "./base"
import Option from "./option"
import {throttle, validVal, debounce} from "../../utils/tool"
import mixin from "./base/mixin"
export default {
    name: "Input",
    inheritAttrs: false,
    mixins: [mixin],
    components: {
        DropBase,
        InputBase,
        Option,
    },
    props: {
        multipleKey: String,
        multiplSplit: {
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
        filterable: {
            type: Boolean,
            default: false,
        },
        keyModal: {
            type: Boolean,
            default: true,
        },
        beforeInput: Function,
        strict: Boolean,
        options: Array,
        optCount: Number,
        max: Number,
        showPassword: Boolean,
    },
    data() {
        return {
            model: "",
            visible: false,
            optComponents: [],
            valueText: "",
            lastOptIndex: this.optCount || 15,
            inOpts: [],
        }
    },
    created() {
        this.__updatedDrop = () => this.$refs.updatedDrop && this.$refs.dropBase.updatedDrop()
        this.searchMethod = throttle((val) => {
            this.$emit("on-search", val)
        }, 360)
        this.$on("on-updated", this.__updatedDrop)
        this.$on("on-option-change", this.getAllOpt)
        this.$on("on-select", this.select)
    },
    mounted() {
        this.handleDispatch("on-change", this.model)
    },
    computed: {
        showDrop() {
            return this.$slots.default || this.hasValidOpts || this.hasOpts
        },
        hasOpts() {
            return Array.isArray(this.options)
        },
        getInOpts() {
            return this.inOpts.filter((opt) => !opt.hidden).slice(0, this.lastOptIndex)
        },
        getOptTip() {
            if (this.tip == null) return this.langs("input.noDataText", "暂无数据")
            return this.tip
        },
        isSelect() {
            return false
        },
        hasValidOpts() {
            const hasTip = this.$slots.tip || this.tip
            return hasTip && this.optComponents.length && !this.optComponents.some((item) => !item.hidden)
        },
    },
    methods: {
        getAllOpt(type, component) {
            const model = this.model
            if (type === "destroy") {
                const index = this.optComponents.indexOf(component)
                index > -1 && this.optComponents.splice(index, 1)
                return
            }
            if (type === "change") {
                component.$emit("on-selected", model)
            }
            if (type === "created") {
                component.$emit("on-selected", model)
                this.optComponents.push(component)
            }
        },
        getMatchedOpt(value, isUpdate) {
            if (isUpdate) {
                this.optComponents.forEach((component) => {
                    component.$emit("on-query-option", value)
                })
            }
            const component = this.optComponents.find((component) => component.hover)
            if (component) component.select()
            return component
        },
        navigateOpts(val) {
            let index,
                optComponents = this.optComponents.filter((component) => !component.hidden),
                lastIndex = optComponents.length - 1
            optComponents.forEach((component, i) => {
                if (component.hover) index = i
                component.hover = false
            })
            if (index == void 0) {
                optComponents.forEach((component, i) => {
                    if (component.selected) index = i
                })
            }
            index = (index || 0) + val
            if (index < 0) index = 0
            if (index > lastIndex) index = lastIndex
            const component = optComponents[index]
            component.hover = true
            this.focusIndex(component, index)
        },
        focusIndex(component, index) {
            if (index < 0) return
            // update scroll
            const element = component.$el,
                parentNode = element.parentNode,
                elementRect = element.getBoundingClientRect(),
                parentRect = parentNode.getBoundingClientRect(),
                bottomOverflowDistance = elementRect.bottom - parentRect.bottom,
                topOverflowDistance = elementRect.top - parentRect.top
            if (bottomOverflowDistance > 0) {
                parentNode.scrollTop += bottomOverflowDistance
            }
            if (topOverflowDistance < 0) {
                parentNode.scrollTop += topOverflowDistance
            }
        },
        selectedOpt(val) {
            this.optComponents.forEach((component) => {
                component.$emit("on-selected", val)
            })
        },
        select(val, text, attach) {
            if (this.multiple) {
                const model = Array.isArray(this.model) ? this.model : [this.model]
                val = model.some((item) => (this.strict ? item === val : item == val))
                    ? model.filter((item) => (this.strict ? item !== val : item != val))
                    : [...model, val]
            } else if (this.autoClose) {
                this.visible = false
            }
            this.__attachData = attach
            this.updateModel(val)
            this.$refs.inputBase.setInputFocus() //有问题无法失去焦点
            this.showDrop && this.$refs.dropBase.cancelChange()
            this.$emit("on-change", this.model, this.__attachData)
        },
        handleFocus(event) {
            this.selectedOpt(this.model)
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
        handleKeydown(event) {
            if (!this.keyModal) return
            if (event.keyCode == 13 && !this.visible && (!this.multiple || (this.multiple && !event.target.value))) {
                this.visible = true
                return
            }
            const visible = this.visible,
                keyCode = event.keyCode
            // Esc slide-up
            // next
            if (keyCode == 38 && visible) {
                event.preventDefault()
                this.navigateOpts(-1)
            }
            if (keyCode == 40 && visible) {
                event.preventDefault()
                this.navigateOpts(1)
            }
            if (keyCode == 13) {
                this.getMatchedOpt() || this.handleModel(event.target.value)
                this.$nextTick(() => {
                    this.$emit("on-enter", this.model, event)
                    this.visible = false
                })
            }
            if (keyCode == 32 && this.isSelect) {
                event.preventDefault()
                const component = this.getMatchedOpt()
                if (!component) this.handleModel(event.target.value)
            }
            if (keyCode == 27) {
                this.visible = false
            }
        },
        handleChange(event) {
            if (this.type === "text") return
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
            const value = await this.handleBeforeInput(event.target.value, event)
            if (!this.multiple) this.valueText = value
            this.__attachData = ""
            if (this.filterable && typeof this.$listeners["on-search"] === "function") {
                this.searchMethod(value, this.model, event)
                return
            }
            if (this.hasOpts) {
                this.handeOptQuery(value)
            } else {
                this.optComponents.forEach((component) => {
                    component.$emit("on-query-option", value, true)
                })
            }
            this.__updatedDrop()
            if (!this.isSelect) {
                if (!this.multiple) {
                    this.updateModel(value)
                    return
                }
                if (this.multiplSplit && value && event.type === "paste") {
                    this.updateModel([...this.model, ...value.split(new RegExp("\\" + this.multiplSplit, "g"))])
                }
            }
        },
        handleBlur(event, inputDom) {
            if (!this.isReadonly) this.handleModel(inputDom.value)
            if (this.type === "number") {
                const value = this.handleRange(this.model)
                value !== void 0 && this.updateModel(value)
            }
            this.$nextTick(() => {
                this.type !== "file" && this.$emit("on-change", this.model, this.__attachData)
                this.$emit("on-blur", this.model, this.__attachData)
                this.__attachData = ""
                this.handleDispatch("on-validate", this.model)
            })
        },
        handleRange(val) {
            if (!validVal(val)) return
            const {max, min} = this.$attrs
            if ((min || min == "0") && val < min) return parseFloat(min)
            if ((max || max == "0") && val > max) return parseFloat(max)
        },
        handleModel(value) {
            const isValid = validVal(value)
            const component = isValid && this.getMatchedOpt(value, true)
            if (component) return
            if (isValid && this.multiple) {
                this.updateModel(Array.isArray(this.model) ? [...this.model, value] : [value])
                return
            }
            if (!this.multiple) this.updateModel(value)
        },
        getValueText() {
            if (this.multiple) {
                const key = this.multipleKey || "name"
                return this.model.map((val) => {
                    if (val && typeof val === "object" && key) return val[key]
                    return val
                })
            }
            const data = this.optComponents.find((item) => {
                // if (this.strict) return item.value === this.model;
                return item.value == this.model
            })
            const text = data && data.text()
            if (this.isSelect) return text == void 0 ? "" : text
            return text === void 0 ? this.model : text
        },
        updateModel(val) {
            if (val === this.model) return
            this.model = val
            this.selectedOpt(val)
            this.valueText = this.getValueText()
            this.$emit("input", val)
            this.handleDispatch("on-change", val)
            if (this.multiple) this.$refs.inputBase.getInputDom().value = ""
            this.__attachData = ""
        },

        //对外提供
        getSelectedOpts() {
            return this.optComponents.filter((component) => component.selected)
        },
        handleScroll(event) {
            if (this.__runOptIndex) return
            const target = event.target
            if (target.scrollHeight - target.scrollTop - target.clientHeight < 60) {
                this.__runOptIndex = true
                this.lastOptIndex += 5
            }
        },
        handeOptQuery(value = "") {
            const model = Array.isArray(this.model) ? this.model : [this.model]
            this.inOpts.forEach((opt) => {
                this.lastOptIndex = this.optCount || 15
                if (value === "" || model.some((val) => (this.strict ? val === opt.value : val == opt.value)))
                    return (opt.hidden = false)
                const parsedQuery = `${value}`
                    .replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function(match, reg, offset, str) {
                        if (reg === "\\") return "\\\\"
                        return reg
                    })
                    .trim()
                try {
                    const text = `${opt.label == void 0 ? opt.value : opt.label}`
                    opt.hidden = !(text.indexOf(value) > -1 || new RegExp(parsedQuery, "i").test(text))
                } catch (error) {
                    console.error(error)
                }
            })
        },
    },
    updated() {
        this.$nextTick(() => {
            this.__runOptIndex = false
        })
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
        options: {
            immediate: true,
            handler(val) {
                this.inOpts = this.hasOpts
                    ? val.map((opt) => {
                          return {
                              ...opt,
                              hidden: false,
                          }
                      })
                    : []
            },
        },
        visible(val) {
            if (val) {
                this.optComponents.forEach((component) => {
                    component.hidden = component.hover = false
                })
                this.handeOptQuery("")
            }

            this.$emit("on-visible-change", val)
        },
    },
}
</script>
