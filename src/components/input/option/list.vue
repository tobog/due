<template>
    <Virtuallist
        :class="classes"
        :data-vue-module="$options.name"
        :total="resultData.length"
        :cellSelector="_tobogPrefix_.slice(0, -1)"
        @on-refresh="handleRefreshSize"
    >
        <div :style="getTransferStyle">
            <template v-for="opt in getSizeData">
                <slot v-bind="opt">
                    <Option v-bind="opt"></Option>
                </slot>
            </template>
        </div>
    </Virtuallist>
</template>
<script>
// 提取opts 单独成list 组件 提供性能 ，键盘操作等功能
// import Icons from "../icons/index"
import Option from "./index2"
import Virtuallist from "../../scroll/virtuallist"
import Emitter from "../../../utils/emitter"
export default {
    inheritAttrs: false,
    name: "Options",
    mixins: [Emitter],
    model: {
        prop: "value",
        event: "on-change",
    },
    components: {
        Option,
        Virtuallist,
    },
    props: {
        data: Array,
        value: {
            type: [String, Array],
            required: true,
        },
        multiple: Boolean,
        strict: Boolean,
        performance: String,
    },
    data() {
        return {
            baseData: [],
            resultData: [],
            sizeInfo: {},
        }
    },
    created() {
        this.$on("on-select", this.select)
        this.$on("on-option-change", this.handleOptChange)
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [_tobogPrefix_, {}]
        },
        getSizeData() {
            if (this.sizeInfo.performance === "middle")
                return this.resultData.slice(0, this.sizeInfo.index + this.sizeInfo.length)
            if (this.sizeInfo.performance === "high")
                return this.resultData.slice(this.sizeInfo.index, this.sizeInfo.index + this.sizeInfo.length)
            return this.resultData
        },
    },
    methods: {
        handleRefreshSize(data) {
            this.sizeInfo = data
        },
        select(val, text, attach) {
            if (this.multiple) {
                const model = Array.isArray(this.model) ? this.model : [this.model]
                val = model.some((item) => (this.strict ? item === val : item == val))
                    ? model.filter((item) => (this.strict ? item !== val : item != val))
                    : [...model, val]
            }
            this.$emit("on-change", val, attach)
        },
        handleOptChange(type, component) {
            if (type === "hover") {
                this._hoverComponent = component
            }
        },
        navigateOpts(val) {
            let compData
            lastIndex = this.resultData.length - 1
            this.resultData.forEach((item, i) => {
                if (item.hover) {
                    compData = {...item, _index: i}
                }
                item.hover = false
            })
            let index = ((compData || selectCompData || {})._index || 0) + val
            if (index < 0) index = 0
            if (index > lastIndex) index = lastIndex
            // const component = optComponents[index]
            // component.hover = true
            // this.focusIndex(component.$el, index)
        },
        focusIndex(element, index) {
            if (index < 0) return
            // update scroll
            const parentNode = element.parentNode,
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
        getStricts(item) {
            if (item.strict !== void 0) return item.strict
            return this.strict === false ? false : true
        },

        queryChange(val = "") {
            if (val === "") {
                this.resultData = this.baseData
                return
            }
            const parsedQuery = `${val}`
                .replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function(match, reg, offset, str) {
                    if (reg === "\\") return "\\\\"
                    return reg
                })
                .trim()
            this.resultData = this.baseData.filter((item) => {
                try {
                    item.hover = item.label === val
                    return item.label.indexOf(val) > -1 ? true : new RegExp(parsedQuery, "ig").test(item.label)
                } catch (error) {
                    console.error(error)
                    return false
                }
            })
        },
        handleHighlight(value = "", data) {
            if (Array.isArray(value) && this.multiple) {
                return this.getStricts(data)
                    ? value.indexOf(data.value) > -1
                    : value.some((val) => {
                          return data.value == val
                      })
            }
            return this.getStricts(data) ? data.value === value : data.value == value
        },
    },
    watch: {
        value: {
            deep: true,
            immediate: true,
            handler(val) {
                this.baseData.forEach((item) => {
                    this.$set(item, "selected", this.handleHighlight(val, item))
                })
            },
        },
        data: {
            immediate: true,
            handler(val) {
                this.baseData = val.map((item) => {
                    return {
                        ...item,
                        hover: false,
                    }
                })
                this.resultData = this.baseData
            },
        },
    },
    beforeDestroy() {},
}
</script>
