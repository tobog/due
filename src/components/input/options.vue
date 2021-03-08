<template>
    <Virtuallist
        ref="virtuallist"
        :class="classes"
        :data-vue-module="$options.name"
        :total="resultData.length"
        :cellSelector="_tobogPrefix_.slice(0, -1)"
        :reset="refreshVirtual"
        v-bind="$attrs.virtualProps"
        @on-refresh="handleRefreshSize"
    >
        <slot
            slot="prefix"
            name="prefix"
            :selected="isCheckAll"
            :theme="theme"
            :value="symbolAll"
            :queryChange="queryChange"
            :select="select"
            :disabled="disabled"
        >
            <Option
                v-if="isHasCheckAll"
                slot="prefix"
                :class="[_tobogPrefix_ + '-check-all']"
                :theme="theme"
                :selected="isCheckAll"
                :value="symbolAll"
                :checkbox="checkbox"
                :label="checkAllLabel || langs('options.checkAllLabel', '全选')"
            ></Option>
        </slot>
        <template v-for="(opt, index) in getSizeData">
            <slot v-bind="opt" :indexInCurrent="index">
                <Option v-bind="opt" :key="opt.value" :indexInCurrent="index"></Option>
            </slot>
        </template>
        <div v-if="!getSizeData.length" :class="[_tobogPrefix_ + '-nodata-text']">
            {{ noDataText || langs("options.noDataText", "暂无相关数据") }}
        </div>
        <slot slot="suffix" name="suffix" :theme="theme" :select="select" :disabled="disabled"></slot>
    </Virtuallist>
</template>
<script>
import Option from "./option"
import Virtuallist from "../scroll/virtuallist"
import Emitter from "../../utils/emitter"
import langMinix from "../../mixins/lang"
import {isParseNumber} from "../../utils/tool"
export default {
    inheritAttrs: false,
    name: "Options",
    componentName: "Options",
    mixins: [Emitter, langMinix],
    model: {
        prop: "value",
        event: "on-change",
    },
    components: {
        Option,
        Virtuallist,
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            },
        },
        value: [String, Array, Number],
        multiple: Boolean,
        strict: Boolean,
        performance: String,
        theme: String,
        regExpMatch: Boolean,
        reset: [Boolean, String, Number],
        noDataText: String,
        checkAllLabel: String,
        disabled: Boolean,
        checkbox: Boolean,
        size: String,
        hasCheckAll: {
            type: Boolean,
            default: true,
        },
        keyModal: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            baseData: [],
            resultData: [],
            sizeInfo: {},
            refreshVirtual: 0,
            symbolAll: Date.now() + "@" + Math.random(),
        }
    },
    created() {
        this.$on("on-select", this.select)
        this.$on("on-option-change", this.handleOptChange)
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-theme-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-size-${this.size}`]: !!this.size && !isParseNumber(this.size),
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                },
            ]
        },
        getSizeData() {
            if (this.sizeInfo.performance === "middle")
                return this.resultData.slice(0, this.sizeInfo.index + this.sizeInfo.length)
            if (this.sizeInfo.performance === "high")
                return this.resultData.slice(this.sizeInfo.index, this.sizeInfo.index + this.sizeInfo.length)
            return this.resultData
        },
        isHasCheckAll() {
            return (
                this.multiple &&
                this.hasCheckAll &&
                !this.disabled &&
                this.resultData.length &&
                !this.baseData.some((item) => item.disabled && !item.selected)
            )
        },
        isCheckAll() {
            return Array.isArray(this.value) && this.value.length > 0 && this.baseData.length <= this.value.length
        },
    },
    methods: {
        init() {
            this.baseData = this.data.map((item, index) => {
                return {
                    ...item,
                    selected: this.$set(item, "selected", this.isSelected(this.value, item)),
                    theme: item.theme || this.theme,
                    hover: false,
                    multiple: this.multiple,
                    disabled: item.disabled || this.disabled,
                    checkbox: this.checkbox,
                    indexInTotal: index,
                    size: this.size,
                }
            })
            this.resultData = this.baseData
            this.refreshVirtual += 1
        },
        handleRefreshSize(data) {
            this.sizeInfo = data
        },
        isSelected(value = "", data) {
            let strict = data.strict || this.strict
            if (Array.isArray(value) && this.multiple) {
                return strict ? value.indexOf(data.value) > -1 : value.some((val) => data.value == val)
            }
            return strict ? data.value === value : data.value == value
        },
        select(val, text, attach, isCancel) {
            if (this.multiple && this.hasCheckAll && val === this.symbolAll) {
                const model = Array.isArray(this.value) ? this.value : []
                val =
                    model.length > 0 && model.length === this.baseData.length
                        ? this.baseData.filter((item) => item.selected && item.disabled).map((item) => item.value)
                        : this.baseData.map((item) => item.value)
            } else if (this.multiple) {
                const model = Array.isArray(this.value) ? this.value : []
                val = model.some((item) => (item.strict || this.strict ? item === val : item == val))
                    ? model.filter((item) => (item.strict || this.strict ? item !== val : item != val))
                    : [...model, val]
            }
            this.$emit("on-change", val, attach, isCancel)
        },
        handleKeydown(event) {
            if (!this.keyModal) return
            const keyCode = event.keyCode
            // Esc slide-up
            // next
            if (keyCode === 38) {
                event.preventDefault()
                this.navigateOpts(-1)
            }
            if (keyCode === 40) {
                event.preventDefault()
                this.navigateOpts(1)
            }
            if (keyCode === 13 && !this.multiple) {
                this.getMatchedOpt()
            }
            if (keyCode === 13 && this.multiple && this._hoverComponent) {
                this.select(this._hoverComponent.value, this._hoverComponent.label, this._hoverComponent.attach)
            }
        },
        handleOptChange(type, component) {
            if (type === "hover") {
                this._hoverComponent = component
                return
            }

            if (type === "destory") {
                this._hoverComponent = null
                return
            }
        },
        navigateOpts(val) {
            let defaultIndex = -1
            let selectIndex = -1
            let compIndex = this.getSizeData.findIndex((item, i) => {
                if (selectIndex === -1 && item.selected) {
                    selectIndex = i
                }
                if (defaultIndex === -1 && !item.disabled) {
                    defaultIndex = i
                }
                return item.hover && !item.disabled
            })
            compIndex = compIndex > -1 ? compIndex : selectIndex
            if (compIndex > -1) {
                let index = compIndex + val
                let nextData = this.getSizeData[index]
                while (nextData) {
                    if (nextData.disabled) {
                        index += val
                        nextData = this.getSizeData[index]
                    } else {
                        break
                    }
                }
                if (!nextData) return
                this.$set(this.getSizeData[compIndex], "hover", false)
                this.$set(nextData, "hover", true)
                this.$nextTick(() => {
                    this._hoverComponent && this.focusIndex(this._hoverComponent.$el)
                })
                return
            }
            if (defaultIndex > -1) {
                this.$set(this.getSizeData[defaultIndex], "hover", true)
                this.$nextTick(() => {
                    this._hoverComponent && this.focusIndex(this._hoverComponent.$el)
                })
            }
        },
        focusIndex(element) {
            if (!element) return
            const parentNode = this.$refs.virtuallist && this.$refs.virtuallist.$refs.list
            if (!parentNode) return
            // update scroll
            const elementRect = element.getBoundingClientRect(),
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
        queryChange(val = "") {
            if (val === "") {
                this.baseData.forEach((item) => {
                    item.hover = false
                    if (!this.multiple) item.selected = false
                })
                this.resultData = this.baseData
                this.refreshVirtual += 1
                return
            }
            const parsedQuery = this.regExpMatch
                ? `${val}`
                      .replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function(match, reg) {
                          if (reg === "\\") return "\\\\"
                          return reg
                      })
                      .trim()
                : false
            this.resultData = this.baseData.filter((item) => {
                try {
                    let text = `${item.label == void 0 ? item.value : item.label}`
                    item.hover = text === val
                    return text.indexOf(val) > -1 ? true : parsedQuery && new RegExp(parsedQuery, "i").test(text)
                } catch (error) {
                    console.error(error)
                    return false
                }
            })
            this.refreshVirtual += 1
        },
        getMatchedOpt(text, isCancel) {
            let isHover = text == void 0
            if (!isHover && !text) return
            return this.getSizeData.some((item) => {
                let bool =
                    !item.disabled && !item.selected && (isHover ? item.hover : `${item.label || item.value}` === text)
                if (bool) {
                    this.select(item.value, item.label, item.attach, isCancel)
                }
                return bool
            })
        },
        handleScrollbar() {
            this.$refs.virtuallist.handleScrollbar()
        },
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.baseData.forEach((item) => {
                    this.$set(item, "hover", !!(this._hoverComponent && this._hoverComponent.value === item.value))
                    this.$set(item, "selected", this.isSelected(val, item))
                })
            },
        },
        data: {
            immediate: true,
            handler() {
                this.init()
            },
        },
        reset(val) {
            if (val) {
                this.baseData.forEach((item) => {
                    this.$set(item, "hover", false)
                })
                this._hoverComponent = null
                this.resultData = this.baseData
            }
        },
    },
    beforeDestroy() {},
}
</script>
