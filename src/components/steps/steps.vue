<template>
    <ul :class="classes" :data-vue-module="$options.name">
        <slot></slot>
    </ul>
</template>
<script>
import { debounce, validVal } from "../../utils/tool";
import Emitter from "../../utils/emitter";
export default {
    name: "Steps",
    mixins: [Emitter],
    props: {
        startIndex: {
            type: Number,
            default: 0,
        },
        value: {
            type: Number,
            // default: 0
        },
        status: {
            // validator(value) {
            // 	return  ['wait', 'process', 'finish', 'error']oneOf(value,);
            // },
            default: "process",
        },
        direction: {
            // validator(value) {
            // 	return oneOf(value, ['horizontal', 'vertical','pre-horizontal', 'pre-vertical']);
            // },
            default: "horizontal",
        },
        slotType: String, //pre,next
        strict: Boolean,
        showArrow: Boolean,
    },
    data() {
        return {
            model: [],
        };
    },
    created() {
        this.handleDispatch("on-none");
        this.__updateChild = debounce(this.updateChildProps, 30);
        this.$on("on-step-change", this.__updateChild);
        this.$on("on-step-flow", this.updateChildStatus);
    },
    watch: {
        status() {
            const value = this.getCurVal;
            if (validVal(value)) {
                this.updateChildStatus(value);
            }
        },
        getValue() {
            this.updateChildProps();
            this.handleInitFlow();
        },
        showArrow() {
            this.updateChildProps();
        },
    },
    computed: {
        getValue() {
            return validVal(this.value)
                ? this.value
                : (this.__parentComponent__ && this.__parentComponent__.parentValue) || 0;
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            const isVertical = `${this.direction}`.indexOf("vertical") > -1;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-vertical`]: isVertical,
                    [`${_tobogPrefix_}-horizontal`]: !isVertical,
                    [`${_tobogPrefix_}-pre`]: `${this.direction}`.indexOf("pre") > -1,
                    [`${_tobogPrefix_}-next`]: `${this.direction}`.indexOf("next") > -1,
                },
            ];
        },
        getCurVal() {
            const data = this.getValue;
            const val = Array.isArray(data) ? data : [data];
            const strict = this.strict;
            return this.model.find((item) => {
                return val.some((value) => {
                    return strict ? value === item : item == value;
                });
            });
        },
    },
    methods: {
        handleInitFlow() {
            const value = this.getCurVal;
            if (validVal(value)) {
                this.updateChildStatus(value);
                this.handleDispatch("on-flow-step", this);
            }
        },
        getCurValIndex(val) {
            return this.model.findIndex((item) => {
                return val === item;
            });
        },
        updateChildStatus(val, isFlow) {
            const _index = this.getCurValIndex(val);
            if (isFlow === true) {
                if (this.__index - _index > 0) return;
                this.__index = _index;
                this.handleDispatch("on-flow-step", this);
            }
            this.$children.forEach((child, index) => {
                if (_index - index > 0) {
                    child.curStatus = "finish";
                    return;
                }
                if (_index == index) {
                    child.curStatus = isFlow ? "finish" : this.status;
                    return;
                }
                child.curStatus = "wait";
            });
        },
        updateChildProps() {
            let direction = this.direction;
            if (this.__parentComponent__) {
                if (`${this.direction}`.indexOf("pre") > -1) {
                    direction = "pre-" + direction;
                } else {
                    direction = "next-" + direction;
                }
            }
            const children = this.$children,
                total = children.length,
                startIndex = Number(this.startIndex || 0),
                parentValue = this.getValue,
                showArrow = this.showArrow,
                model = [];
            children.forEach((child, index) => {
                index = startIndex + index;
                const val = child.value !== void 0 ? child.value : index;
                child.parentValue = parentValue;
                child.stepNumber = index;
                child.total = total;
                child.direction = direction;
                child.showArrow = showArrow;
                model.push(val);
            });
            this.model = model;
            setTimeout(() => {
                this.handleInitFlow();
            }, 20);
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args);
            } else {
                this.__parentComponent__ = this.dispatch("Step", ...args);
            }
        },
    },
    watch: {
        value() {
            this.updateChildProps();
        },
    },
    beforeDestroy() {
        this.__updateChild && this.__updateChild.cancel();
        this.__updateChild = null;
    },
};
</script>
