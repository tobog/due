<template>
    <section :class="wrapClasses" :data-vue-module="$options.name" @click="handleClickPercent">
        <span :class="[_tobogPrefix_ + '-bar-left']" :style="getLeftStyle" ref="leftBar">
            <span
                :class="[_tobogPrefix_ + '-btn']"
                ref="leftBtn"
                @click.stop
                :data-status="showTooltipStatus === 'left'"
            >
                <span :class="[_tobogPrefix_ + '-btn-inner']"></span>
                <span v-if="showTooltip" :class="[_tobogPrefix_ + '-tooltip']">{{ tooltipFormat(model[0]) }}</span>
            </span>
        </span>
        <span v-if="isRange" :class="[_tobogPrefix_ + '-bar-right']" :style="getRightStyle" ref="rightBar">
            <span
                :class="[_tobogPrefix_ + '-btn']"
                ref="rightBtn"
                @click.stop
                :data-status="showTooltipStatus === 'right'"
            >
                <span :class="[_tobogPrefix_ + '-btn-inner']"></span>
                <span v-if="showTooltip" :class="[_tobogPrefix_ + '-tooltip']">{{ tooltipFormat(model[1]) }}</span>
            </span>
        </span>
        <template v-if="getStops">
            <span
                v-for="index of getStops"
                :key="index"
                :style="handleSpotStyle(index)"
                :class="[_tobogPrefix_ + '-spot']"
            ></span>
        </template>
        <input type="hidden" v-if="name || name == '0'" :value="model" :name="name" />
    </section>
</template>

<script>
import { DragMove } from "../../utils/dom"
import { unit, validVal, parseNumber } from "../../utils/tool"
import Offset from "../../utils/offset"
import emitter from "../../utils/emitter"
export default {
    name: "Slider",
    mixins: [emitter],
    model: {
        prop: "value",
        event: "on-change",
    },
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
        tooltipFormat: {
            type: Function,
            default(val) {
                return val
            },
        },
        disabled: Boolean,
        readonly: Boolean,
        showTooltip: Boolean, //['hover', 'always', 'never']
        theme: String,
    },
    data() {
        return {
            percentLeft: 0,
            percentRight: 0,
            model: [0],
            showTooltipStatus: "",
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.dragMove()
            this.handleDispatch("on-change", this.getModel)
        })
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                    [`${_tobogPrefix_}-range`]: this.isRange,
                },
            ]
        },
        getModel() {
            return this.isRange ? this.model : this.model[0]
        },
        isRange() {
            return Array.isArray(this.value)
        },
        getLeftStyle() {
            return {
                width: unit(this.percentLeft, "%"),
            }
        },
        getRightStyle() {
            return {
                left: unit(this.percentRight, "%"),
            }
        },

        getStops() {
            const step = parseNumber(this.step)
            let value
            if (step) {
                value = parseInt((this.max - this.min) / step)
            }
            return value <= 100 && value >= 1 ? value : false
        },
    },
    methods: {
        dragMove() {
            const { leftBar, rightBar, leftBtn, rightBtn } = this.$refs
            if (!this._leftBarDragMove && leftBar && leftBtn) {
                this._leftBarDragMove = new DragMove(leftBtn, { props: ["offsetLeft"] }, this.handleLeftPos)
            }
            if (this.isRange && !this._rightBarDragMove && rightBar && rightBtn) {
                this._rightBarDragMove = new DragMove(rightBar, { props: ["offsetLeft"] }, this.handleRightPos)
            }
        },
        handleLeftPos(obj) {
            if (obj.status == 0) return;
            if (this.disabled || this.readonly) return
            this.showTooltipStatus = "left"
            if (obj.cancel) {
                this.showTooltipStatus = ""
                this.handleChange()
                return
            }
            const { data, distance, element } = obj
            let percent = this.pipe(data.offsetLeft + element.offsetWidth + distance[0])
            if (percent > 100) percent = 100
            if (percent < 0) percent = 0
            if (percent - this.percentRight > 0) this.percentRight = percent
            this.percentLeft = percent
            this.updateModel()
        },
        handleRightPos(obj) {
            if (obj.status == 0) return;
            if (this.disabled || this.readonly) return
            this.showTooltipStatus = "right"
            if (obj.cancel) {
                this.showTooltipStatus = ""
                this.handleChange()
                return
            }
            const { data, distance } = obj
            let percent = this.pipe(data.offsetLeft + distance[0])
            if (percent > 100) percent = 100
            if (percent < 0) percent = 0
            if (percent - this.percentLeft < 0) this.percentLeft = percent
            this.percentRight = percent
            this.updateModel()
        },
        handleClickPercent(event) {
            if (this.disabled || this.readonly) return
            const { clientX } = event,
                { left } = Offset.boundingClientRect(this.$el),
                pos = clientX - left
            const percent = this.pipe(pos)
            if (this.isRange && this.percentLeft - percent < 0) {
                if (2 * percent - this.percentLeft - this.percentRight > 0) {
                    this.percentRight = percent
                } else {
                    this.percentLeft = percent
                }
            } else {
                this.percentLeft = percent
            }
            this.updateModel()
        },
        pipe(percent) {
            percent = this.pipePercent(percent)
            percent = this.pipeMaxMin(percent)
            percent = this.pipeSpotPercent(percent)
            return percent.toFixed(3)
        },
        pipePercent(value = 0) {
            const { offsetWidth } = this.$el
            return (value / offsetWidth) * 100
        },
        pipeMaxMin(percent) {
            if (percent > 100) percent = 100
            if (percent < 0) percent = 0
            return percent
        },
        handleSpotStyle(index) {
            const total = this.getStops
            return {
                left: (100 / total) * index + "%",
            }
        },
        pipeSpotPercent(percent) {
            const total = this.getStops
            if (!total) return percent
            const per = 100 / total
            return Math.round(percent / per) * per
        },
        updatePercent() {
            const [leftVal, rightVal] = this.model
            const percentTotal = 100 / (this.max - this.min)
            this.percentLeft = validVal(leftVal) ? (leftVal - this.min) * percentTotal : 0
            this.percentRight = validVal(rightVal) ? (rightVal - this.min) * percentTotal : 0
            if (this.percentLeft < 0) this.percentLeft = 0
            if (this.percentRight < 0) this.percentRight = 0
            if (this.percentRight > 100) this.percentRight = 100
            if (this.percentLeft > 100) this.percentLeft = 100
        },
        updateModel() {
            const rate = (this.max - this.min) / 100
            this.$set(this.model, 0, (rate * this.percentLeft + this.min).toFixed(3) * 1)
            this.$set(this.model, 1, (rate * this.percentRight + this.min).toFixed(3) * 1)
            // this.model[0] = rate * this.percentLeft + this.min;
            // this.model[1] = rate * this.percentRight + this.min;
        },
        handleChange() {
            this.$nextTick(() => {
                this.$emit("on-change", this.getModel)
            })
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch("FormItem", ...args)
            }
        },
    },
    watch: {
        model(val) {
            val = this.getModel
            // this.$emit("input", val);
            this.$emit("on-change", val)
            this.handleDispatch("on-change", val)
        },
        value: {
            deep: true,
            immediate: true,
            handler(val) {
                if (!this.isRange) val = [val]
                if (val[0] == this.model[0] && val[1] == this.model[1]) return
                this.model = val
                this.updatePercent()
            },
        },
    },
    beforeDestroy() {
        this._leftBarDragMove && this._leftBarDragMove.destroy()
        this._rightBarDragMove && this._rightBarDragMove.destroy()
        this._leftBarDragMove = this._rightBarDragMove = null
    },
}
</script>
