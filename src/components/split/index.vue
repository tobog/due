<template>
    <section :class="wrapClasses" :data-vue-module="$options.name">
        <div :style="getFirstStyle" :class="[_tobogPrefix_ + '-first']">
            <slot></slot>
        </div>
        <div :style="getSplitStyle" ref="split" :class="[_tobogPrefix_ + '-split']">
            <slot name="split"></slot>
        </div>
        <span :class="[_tobogPrefix_ + '-trigger']" ref="trigger" :style="getTriggerStyle">
            <slot name="trigger">
                <i v-once v-for="index in 6" :key="index" :class="[_tobogPrefix_ + '-trigger-bar']"></i>
            </slot>
        </span>
    </section>
</template>

<script>
import { DragMove } from "../../utils/dom"
export default {
    name: "Split",
    props: {
        value: {
            type: Number,
            default: 50,
        },
        vertical: {
            type: Boolean,
            // default: 'horizontal' //horizontal ,vertical
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
    },
    data() {
        return {
            percentValue: this.value,
            ready: false,
            moving: false,
        }
    },
    mounted() {
        this.dragMove()
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if (this.percentValue === val) return
                this.percentValue = this.pipeMaxMin(val)
            },
        },
        percentValue(val) {
            this.$emit("input", val)
            this.$emit("on-change", val)
        },
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-vertical`]: this.vertical,
                    [`${_tobogPrefix_}-moving`]: this.moving,
                },
            ]
        },
        getFirstStyle() {
            const percent = 100 - this.percentValue + "%"
            return this.vertical ? { bottom: percent } : { right: percent }
        },
        getSplitStyle() {
            const percent = (this.ready || !this.ready) && this.percentValue + this.getTriggerPercent() + "%"
            return this.vertical ? { top: percent } : { left: percent }
        },
        getTriggerStyle() {
            const percent = this.percentValue + "%"
            return this.vertical ? { top: percent } : { left: percent }
        },
    },
    methods: {
        dragMove() {
            this.$nextTick(() => {
                this.ready = true
                this._DragMove =
                    this.$refs.trigger &&
                    new DragMove(
                        this.$refs.trigger,
                        { props: ["offsetLeft", "offsetTop"], cursor: "" },
                        this.handleOffset
                    )
            })
        },
        handleOffset(obj) {
            if (obj.cancel) {
                this.moving = false
                this.$emit("on-move-end", this.percentValue)
                return
            }

            const { data, distance } = obj
            let percent = this.pipePercent(this.vertical ? data.offsetTop + distance[1] : data.offsetLeft + distance[0])
            percent = this.pipeMaxMin(percent)
            this.percentValue = percent
            if (!this.move) this.$emit("on-move-start", percent)
            this.moving = true
            this.$emit("on-move", percent)
        },
        pipePercent(val) {
            const { layout } = this.getBaseSize()
            return (val / layout) * 100
        },
        pipeMaxMin(value) {
            const max = Math.min(this.max - this.getTriggerPercent(), 100),
                min = Math.max(this.min, 0)
            if (value > max) value = max
            if (value < min) value = min
            return value.toFixed(3) / 1
        },
        getBaseSize() {
            const { trigger } = this.$refs,
                ele = this.$el
            return this.vertical
                ? {
                      layout: (ele && ele.clientHeight) || 1,
                      trigger: (trigger && trigger.offsetHeight) || 0,
                  }
                : {
                      layout: (ele && ele.clientWidth) || 1,
                      trigger: (trigger && trigger.offsetWidth) || 0,
                  }
        },
        getTriggerPercent() {
            const { layout, trigger } = this.getBaseSize()
            return (trigger / layout) * 100
        },
    },
    beforeDestroy() {
        this._DragMove && this._DragMove.destroy()
        this._DragMove = null
    },
}
</script>
