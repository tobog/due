<template>
    <section :class="wrapClasses" :data-vue-module="$options.name" @click="handleClickPercent">
        <!-- <span :class="[_tobogPrefix_ + '-bar-left']" :style="getLeftStyle" ref="leftBar"> -->
        <span :class="[_tobogPrefix_ + '-bar']" :style="getBarStyle"></span>
        <span
            :class="[_tobogPrefix_ + '-btn']"
            ref="leftBtn"
            :style="{ left: percentLeft + '%' }"
            :data-status="showTooltipStatus === 'left'"
        >
            <!-- <span :class="[_tobogPrefix_ + '-btn-inner']"></span> -->
            <span v-if="showTooltip" :class="[_tobogPrefix_ + '-tooltip']">{{
                tooltipFormat(model[0], "tooltip")
            }}</span>
        </span>
        <!-- </span> -->
        <!-- <span v-if="isRange" :class="[_tobogPrefix_ + '-bar-right']" :style="getRightStyle" ref="rightBar"> -->
        <span
            v-if="isRange"
            :class="[_tobogPrefix_ + '-btn']"
            ref="rightBtn"
            :style="{ left: percentRight + '%' }"
            :data-status="showTooltipStatus === 'right'"
        >
            <!-- <span :class="[_tobogPrefix_ + '-btn-inner']"></span> -->
            <span v-if="showTooltip" :class="[_tobogPrefix_ + '-tooltip']">{{
                tooltipFormat(model[1], "tooltip")
            }}</span>
        </span>
        <!-- </span> -->
        <template v-if="getStops">
            <span
                v-for="index of getStops"
                :key="index"
                :style="handleSpotStyle(index, 1)"
                :class="[_tobogPrefix_ + '-spot']"
                @click.stop="handleClickPercent(1, index)"
            ></span>
        </template>
        <template v-if="marks && marks.length">
            <span
                v-for="(mark, index) of getMarks"
                :key="mark.value || index"
                :style="handleSpotStyle(mark, 2)"
                :class="[_tobogPrefix_ + '-mark']"
                @click.stop="handleClickPercent(2, mark)"
            >
                <span
                    v-if="typeof mark.render === 'function'"
                    :class="[_tobogPrefix_ + '-mark-text']"
                    :style="mark.style"
                >
                    <RenderFn v-bind="mark" :render="mark.render"></RenderFn>
                </span>
                <span v-else-if="mark.label !== void 0" :style="mark.style" :class="[_tobogPrefix_ + '-mark-text']">
                    {{ mark.label }}
                </span>
            </span>
        </template>
        <input type="hidden" v-if="name || name == '0'" :value="model" :name="name" />
    </section>
</template>

<script>
import { DragMove } from "../../utils/dom";
import { validVal, parseNumber } from "../../utils/tool";
import Offset from "../../utils/offset";
import emitter from "../../utils/emitter";
import RenderFn from "../base/render";
export default {
    name: "Slider",
    mixins: [emitter],
    components: { RenderFn },
    props: {
        name: String,
        value: {
            type: [Number, Array],
            default: 0,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        step: {
            type: Number,
            default: 0,
        },
        // showStepTooltip: Boolean,
        tooltipFormat: {
            type: Function,
            default(val) {
                return val;
            },
        },
        disabled: Boolean,
        readonly: Boolean,
        showTooltip: Boolean, //['hover', 'always', 'never']
        theme: String,
        range: Boolean,
        marks: [Array, Object],
    },
    data() {
        return {
            percentLeft: 0,
            percentRight: 0,
            model: [0],
            showTooltipStatus: "",
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.dragMove();
            this.handleDispatch("on-change", this.getModel);
        });
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                    [`${_tobogPrefix_}-range`]: this.isRange,
                },
            ];
        },
        getModel() {
            return this.isRange ? this.model : this.model[0];
        },
        isRange() {
            return this.range || Array.isArray(this.value);
        },
        getStops() {
            const step = parseNumber(this.step);
            let value;
            if (step) {
                value = parseInt((this.max - (this.min || 0)) / step);
            }
            return value <= 100 && value >= 1 ? value : false;
        },
        getBarStyle() {
            if (this.isRange) {
                const min = this.percentLeft - this.percentRight <= 0 ? this.percentLeft : this.percentRight;
                return {
                    left: min + "%",
                    width: Math.abs(this.percentLeft - this.percentRight) + "%",
                };
            }
            return {
                left: 0,
                width: this.percentLeft + "%",
            };
        },
        getMarks() {
            if (Array.isArray(this.marks)) return this.marks;
            if (this.marks && typeof this.marks === "object") {
                return Object.keys(this.marks).map((key) => {
                    return {
                        value: key,
                        ...this.marks[key],
                    };
                });
            }
            return null;
        },
    },
    methods: {
        dragMove() {
            const { leftBtn, rightBtn } = this.$refs;
            if (!this._leftDragMove && leftBtn) {
                this._leftDragMove = new DragMove(leftBtn, { props: ["offsetLeft"] }, (obj) => {
                    if (obj.status == 0) return;
                    this.handlePos("left", obj);
                });
            }
            if (this.isRange && !this._rightBDragMove && rightBtn) {
                this._rightBDragMove = new DragMove(rightBtn, { props: ["offsetLeft"] }, (obj) => {
                    if (obj.status == 0) return;
                    this.handlePos("right", obj);
                });
            }
        },
        handlePos(type, obj) {
            if (this.disabled || this.readonly) return;
            this.showTooltipStatus = type;
            if (obj.cancel) {
                this.showTooltipStatus = "";
                this.handleChange();
                return;
            }
            const { data, distance } = obj;
            let percent = this.pipe(data.offsetLeft + distance[0]);
            if (percent > 100) percent = 100;
            if (percent < 0) percent = 0;
            this[type === "left" ? "percentLeft" : "percentRight"] = percent;
            this.updateModel();
        },
        handleClickPercent(event, data) {
            if (this.disabled || this.readonly) return;
            let percent;
            if (event === 1) {
                percent = (100 / this.getStops) * data;
                percent = this.pipe(percent, true);
            } else if (event === 2) {
                percent =
                    `${data.value}`.indexOf("%") > -1
                        ? parseFloat(data.value)
                        : (data.value / (this.max - (this.min || 0))) * 100;
                percent = this.pipe(percent, true);
            } else {
                percent = event.clientX - Offset.boundingClientRect(this.$el).left;
                percent = this.pipe(percent);
            }
            if (this.isRange && this.percentLeft - percent < 0) {
                if (2 * percent - this.percentLeft - this.percentRight > 0) {
                    this.percentRight = percent;
                } else {
                    this.percentLeft = percent;
                }
            } else {
                this.percentLeft = percent;
            }
            this.updateModel();
        },
        pipe(percent, isCancel) {
            percent = this.pipePercent(percent, isCancel);
            percent = this.pipeMaxMin(percent);
            percent = this.pipeSpotPercent(percent);
            return percent.toFixed(3);
        },
        pipePercent(value = 0, isCancel) {
            if (isCancel) return value;
            const { offsetWidth } = this.$el;
            return (value / offsetWidth) * 100;
        },
        pipeMaxMin(percent) {
            if (percent > 100) percent = 100;
            if (percent < 0) percent = 0;
            return percent;
        },
        handleSpotStyle(data, index) {
            return {
                left:
                    index === 1
                        ? (100 / this.getStops) * data + "%"
                        : `${data.value}`.indexOf("%") > -1
                        ? data.value
                        : (data.value / (this.max - (this.min || 0))) * 100 + "%",
            };
        },
        // handleMarkStyle(mark) {
        //     return {
        //         left: `${mark.value}`.indexOf("%") > -1 ? mark.value : (mark.value / (this.max - (this.min||0))) * 100 + "%",
        //     }
        // },
        pipeSpotPercent(percent) {
            if (!this.getStops) return percent;
            const per = 100 / this.getStops;
            return Math.round(percent / per) * per;
        },
        updatePercent() {
            const [leftVal, rightVal] = this.model;
            const percentTotal = 100 / (this.max - (this.min || 0));
            this.percentLeft = validVal(leftVal) ? (leftVal - (this.min || 0)) * percentTotal : 0;
            this.percentRight = validVal(rightVal) ? (rightVal - (this.min || 0)) * percentTotal : 0;
            if (this.percentLeft < 0) this.percentLeft = 0;
            if (this.percentRight < 0) this.percentRight = 0;
            if (this.percentRight > 100) this.percentRight = 100;
            if (this.percentLeft > 100) this.percentLeft = 100;
        },
        updateModel() {
            const rate = (this.max - (this.min || 0)) / 100;
            this.$set(this.model, 0, (rate * this.percentLeft + (this.min || 0)).toFixed(3) * 1);
            this.$set(this.model, 1, (rate * this.percentRight + (this.min || 0)).toFixed(3) * 1);
        },
        handleChange() {
            this.$nextTick(() => {
                this.$emit("on-change", this.getModel);
                this.handleDispatch("on-validate", this.getModel, "change");
            });
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args);
            } else {
                this.__parentComponent__ = this.dispatch("FormItem", ...args);
            }
        },
    },
    watch: {
        model(val) {
            val = this.getModel;
            this.$emit("input", val);
            this.handleDispatch("on-change", val);
        },
        value: {
            deep: true,
            immediate: true,
            handler(val) {
                if (!this.isRange) val = [val];
                if (val[0] == this.model[0] && val[1] == this.model[1]) return;
                this.model = val;
                this.updatePercent();
            },
        },
    },
    beforeDestroy() {
        this._leftDragMove && this._leftDragMove.destroy();
        this._rightBDragMove && this._rightBDragMove.destroy();
        this._leftDragMove = this._rightBDragMove = null;
    },
};
</script>
