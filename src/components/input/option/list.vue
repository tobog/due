<template>
    <Virtuallist
        :class="classes"
        :data-vue-module="$options.name"
        :total="resultData.length"
        :cellSelector="_tobogPrefix_.slice(0, -1)"
        :reset="refreshVirtual"
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
    componentName: "Options",
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
        value: [String, Array],
        multiple: Boolean,
        strict: Boolean,
        performance: String,
        theme: String,
        regExpMatch: Boolean,
        keyModal: Boolean,
        reset: Boolean,
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
                const model = Array.isArray(this.value) ? this.value : [this.value];
                val = model.some((item) => (this.getStricts(item) ? item === val : item == val))
                    ? model.filter((item) => (this.getStricts(item) ? item !== val : item != val))
                    : [...model, val];
            }
            this.$emit("on-change", val, attach);
        },

        handleKeydown(event) {
            if (!this.keyModal) return;
            const keyCode = event.keyCode;
            // Esc slide-up
            // next
            if (keyCode === 38) {
                event.preventDefault();
                this.navigateOpts(-1);
            }
            if (keyCode === 40) {
                event.preventDefault();
                this.navigateOpts(1);
            }
            if (keyCode === 13) {
                this.getMatchedOpt(null, true) || this.getMatchedOpt(event.target.value);
            }
        },
        handleOptChange(type, component) {
            if (type === "hover") {
                this._hoverComponent = component;
            }

            if (type === "destory") {
                this._hoverComponent = null;
            }
        },
        navigateOpts(val) {
            let defaultIndex = -1;
            let selectIndex = -1;
            let compIndex = this.getSizeData.findIndex((item, i) => {
                if (selectIndex === -1 && item.selected) {
                    selectIndex = i;
                }
                if (defaultIndex === -1 && !item.disabled) {
                    defaultIndex = i;
                }
                return item.hover && !item.disabled;
            });
            compIndex = compIndex > -1 ? compIndex : selectIndex;
            if (compIndex > -1) {
                let index = compIndex + val;
                let nextData = this.getSizeData[index];
                while (nextData) {
                    if (nextData.disabled) {
                        index += val;
                        nextData = this.getSizeData[index];
                    } else {
                        break;
                    }
                }
                if (!nextData) return;
                this.$set(this.getSizeData[compIndex], "hover", false);
                this.$set(nextData, "hover", true);
                this.$nextTick(() => {
                    this._hoverComponent && this.focusIndex(this._hoverComponent.$el);
                });
                return;
            }
            if (defaultIndex > -1) {
                this.$set(this.getSizeData[defaultIndex], "hover", true);
                this.$nextTick(() => {
                    this._hoverComponent && this.focusIndex(this._hoverComponent.$el);
                });
            }
        },
        focusIndex(element) {
            if (!element) return;
            // update scroll
            const parentNode = this.$el,
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
                this.baseData.forEach((item) => {
                    item.hover = false;
                });
                this.resultData = this.baseData;
                this.refreshVirtual += 1;
                return;
            }
            const parsedQuery = this.regExpMatch
                ? `${val}`
                      .replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function(match, reg) {
                          if (reg === "\\") return "\\\\";
                          return reg;
                      })
                      .trim()
                : false;
            this.resultData = this.baseData.filter((item) => {
                try {
                    let text = `${item.label || item.value}`;
                    item.hover = text === val;
                    return text.indexOf(val) > -1 ? true : parsedQuery && new RegExp(parsedQuery, "i").test(text);
                } catch (error) {
                    console.error(error);
                    return false;
                }
            });
            this.refreshVirtual += 1;
        },
        getMatchedOpt(text, isHover) {
            if (!text && !isHover) return false;
            return this[isHover ? "getSizeData" : "resultData"].some((item) => {
                let bool = isHover
                    ? item.hover && !item.disabled && !item.selected
                    : `${item.label || item.value}` === text;
                if (bool) {
                    this.select(item.value, item.label, item.attach);
                }
                return bool;
            });
        },
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.baseData.forEach((item) => {
                    this.$set(item, "hover", false);
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
        reset(val) {
            if (val) this.resultData = this.baseData;
        },
    },
    beforeDestroy() {},
};
</script>
