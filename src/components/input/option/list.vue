<template>
    <Virtuallist
        :class="classes"
        :data-vue-module="$options.name"
        :total="resultData.length"
        :cellSelector="_tobogPrefix_.slice(0, -1)"
        :refresh="refreshVirtual"
        @on-refresh="handleRefreshSize"
    >
        <template v-for="opt in getSizeData">
            <slot v-bind="opt">
                <Option v-bind="opt" :key="opt.value"></Option>
            </slot>
        </template>
    </Virtuallist>
</template>
<script>
// 提取opts 单独成list 组件 提供性能 ，键盘操作等功能
// import Icons from "../icons/index"
import Option from "./index2";
import Virtuallist from "../../scroll/virtuallist";
import Emitter from "../../../utils/emitter";
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
        data: {
            type: Array,
            default() {
                return [];
            },
        },
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
            refreshVirtual: 0,
        };
    },
    created() {
        this.$on("on-select", this.select);
        this.$on("on-option-change", this.handleOptChange);
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [_tobogPrefix_, {}];
        },
        getSizeData() {
            if (this.sizeInfo.performance === "middle")
                return this.resultData.slice(0, this.sizeInfo.index + this.sizeInfo.length);
            if (this.sizeInfo.performance === "high")
                return this.resultData.slice(this.sizeInfo.index, this.sizeInfo.index + this.sizeInfo.length);
            return this.resultData;
        },
    },
    methods: {
        init() {
            this.baseData = this.data.map((item) => {
                return {
                    ...item,
                    selected: this.$set(item, "selected", this.handleHighlight(this.value, item)),
                    theme: item.theme || this.theme,
                    hover: false,
                };
            });
            this.resultData = this.baseData;
            this.refreshVirtual += 1;
        },
        handleRefreshSize(data) {
            this.sizeInfo = data;
        },
        getStricts(item) {
            if (item.strict !== void 0) return item.strict;
            return this.strict === false ? false : true;
        },
        handleHighlight(value = "", data) {
            if (Array.isArray(value) && this.multiple) {
                return this.getStricts(data)
                    ? value.indexOf(data.value) > -1
                    : value.some((val) => {
                          return data.value == val;
                      });
            }
            return this.getStricts(data) ? data.value === value : data.value == value;
        },
        select(val, text, attach) {
            if (this.multiple) {
                const model = Array.isArray(this.model) ? this.model : [this.model];
                val = model.some((item) => (this.strict ? item === val : item == val))
                    ? model.filter((item) => (this.strict ? item !== val : item != val))
                    : [...model, val];
            }
            this.$emit("on-change", val, attach);
        },
        handleOptChange(type, component) {
            if (type === "hover") {
                this._hoverComponent = component;
            }
        },
        handleKeydown(event) {
            if (!this.keyModal) return;
            if (event.keyCode == 13 && !this.visible && (!this.multiple || (this.multiple && !event.target.value))) {
                this.visible = true;
                return;
            }
            const visible = this.visible,
                keyCode = event.keyCode;
            // Esc slide-up
            // next
            if (keyCode == 38 && visible) {
                event.preventDefault();
                this.navigateOpts(-1);
            }
            if (keyCode == 40 && visible) {
                event.preventDefault();
                this.navigateOpts(1);
            }
            if (keyCode == 13) {
                this.getMatchedOpt() || this.handleModel(event.target.value);
                this.$nextTick(() => {
                    this.$emit("on-enter", this.model, event);
                    this.visible = false;
                });
            }
            if (keyCode == 32 && this.isSelect) {
                event.preventDefault();
                const component = this.getMatchedOpt();
                if (!component) this.handleModel(event.target.value);
            }
            if (keyCode == 27) {
                this.visible = false;
            }
        },
        navigateOpts(val) {
            // let compData,
            // lastIndex = this.resultData.length - 1
            // this.resultData.forEach((item, i) => {
            //     if (item.hover) {
            //         compData = {...item, _index: i}
            //     }
            //     item.hover = false
            // })
            // let index = ((compData || {})._index || 0) + val
            // if (index < 0) index = 0
            // if (index > lastIndex) index = lastIndex
            // const component = optComponents[index]
            // component.hover = true
            // this.focusIndex(component.$el, index)
        },
        focusIndex(element, index) {
            if (index < 0) return;
            // update scroll
            const parentNode = element.parentNode,
                elementRect = element.getBoundingClientRect(),
                parentRect = parentNode.getBoundingClientRect(),
                bottomOverflowDistance = elementRect.bottom - parentRect.bottom,
                topOverflowDistance = elementRect.top - parentRect.top;
            if (bottomOverflowDistance > 0) {
                parentNode.scrollTop += bottomOverflowDistance;
            }
            if (topOverflowDistance < 0) {
                parentNode.scrollTop += topOverflowDistance;
            }
        },

        queryChange(val = "") {
            if (val === "") {
                this.resultData = this.baseData;
                return;
            }
            const parsedQuery = `${val}`
                .replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function(match, reg, offset, str) {
                    if (reg === "\\") return "\\\\";
                    return reg;
                })
                .trim();
            this.resultData = this.baseData.filter((item) => {
                try {
                    let text = `${item.label || item.value}`;
                    item.hover = text === val;
                    return text.indexOf(val) > -1 ? true : new RegExp(parsedQuery, "ig").test(text);
                } catch (error) {
                    console.error(error);
                    return false;
                }
            });
            this.refreshVirtual += 1;
        },
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.baseData.forEach((item) => {
                    this.$set(item, "selected", this.handleHighlight(val, item));
                });
            },
        },
        data: {
            immediate: true,
            handler() {
                this.init();
            },
        },
    },
    beforeDestroy() {},
};
</script>
