<template>
    <ul :class="classes" :data-vue-module="$options.name" :style="getStyle">
        <slot></slot>
    </ul>
</template>

<script>
import {unit, throttle} from "../../../utils/tool"
import mediaSize from "../../../mixins/mediaSize"
export default {
    name: "Fluid",
    componentName: "Fluid",
    mixins: [mediaSize],
    props: {
        type: String, //'column','position',
        size: [Number, String],
        column: Number,
        gap: [Array, String, Number],
        toEdge: {
            type: Boolean,
            default: true,
        },
    },
    beforeCreate() {
        this.__applyResize = false
    },
    data() {
        return {
            outerWidth: 0,
            outerHeight: 0,
        }
    },
    created() {
        this.__getClientSize = throttle(this.init, 120)
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.type}`]: this.type === "column" || this.type === "position",
                },
            ]
        },
        getColumnCount() {
            let size = this.size
            let [gap = 0] = this.getColumnGap
            let outerWidth = this.toEdge ? this.outerWidth + gap : this.outerWidth
            if (size) {
                size =
                    (`${size}`.indexOf("%") > -1 ? (this.outerWidth * parseFloat(size)) / 100 : parseFloat(size)) + gap
                return Math.floor(outerWidth / size)
            }
            if (!this.column) {
                return Math.floor(outerWidth / (200 + gap))
            }
            return this.column
        },
        getCellSize() {
            let [gap = 0] = this.getColumnGap
            if (this.type !== "position") {
                return this.size
                    ? `${this.size}`.indexOf("%") > -1
                        ? this.outerWidth / parseFloat(this.size)
                        : this.size
                    : this.column
                    ? (1 / this.column) * this.outerWidth
                    : null
            }
            if (this.size) return this.size
            if (this.column) {
                let outerWidth = this.toEdge ? this.outerWidth + gap : this.outerWidth
                return (1 / this.column) * outerWidth - gap
            }
            return 200
        },
        getStyle() {
            const [gap = 0] = this.getColumnGap
            return this.type === "position"
                ? {
                      minHeight: this.outerHeight + "px",
                  }
                : {
                      columnWidth: unit(this.getCellSize),
                      columnGap: unit(this.getColumnGap[0] || 0),
                      paddingLeft: this.toEdge ? null : gap / 2 + "px",
                      paddingRight: this.toEdge ? null : gap / 2 + "px",
                  }
        },
        getColumnGap() {
            let gap = []
            if (Array.isArray(this.gap)) {
                gap = this.gap
            } else {
                gap = [this.gap || 0, this.gap || 0]
            }
            if (gap[0] && `${gap[0]}`.indexOf("%") > -1) {
                gap[0] = (parseFloat(gap[0]) / 100) * this.outerWidth
            }
            if (gap[1] && `${gap[1]}`.indexOf("%") > -1) {
                gap[1] = (parseFloat(gap[1]) / 100) * this.outerWidth
            }
            if (gap[0]) gap[0] = parseFloat(gap[0])
            if (gap[1]) gap[1] = parseFloat(gap[1])
            return gap
        },
    },
    methods: {
        init() {
            console.log(this)
            this.$nextTick(() => {
                this.outerWidth = this.$el.clientWidth
                if (this.type !== "position") return
                const length = this.$children.length
                const column = this.getColumnCount
                const [gap0 = 0, gap1 = 0] = this.getColumnGap
                const heightArr = []
                const gapNum = this.toEdge ? 0 : 0.5
                for (let i = 0; i < length; i++) {
                    const child = this.$children[i]
                    const height = child.$el.offsetHeight
                    if (i < column) {
                        child.position = [i * 100 + "%", 0, unit(gap0, i + gapNum)]
                        child.index = `${i}-${i};`
                        heightArr.push(height)
                    } else {
                        let index = heightArr.findIndex((val) => val === Math.min(...heightArr))
                        child.position = [index * 100 + "%", heightArr[index] + gap1 + "px", unit(gap0, index + gapNum)]
                        child.index = `${index}-${i};`
                        heightArr[index] += height + gap1
                    }
                }

                this.outerHeight = Math.max(...heightArr)
            })
        },
        refresh(isEmit = true) {
            this.__getClientSize && this.__getClientSize()
            isEmit === true &&
                this.$nextTick(() => {
                    this.$emit("on-refresh")
                })
        },
    },
    watch: {
        type() {
            this.refresh()
        },
    },
    beforeDestroy() {
        this.__getClientSize && this.__getClientSize.cancel()
        this.__getClientSize = null
    },
}
</script>
