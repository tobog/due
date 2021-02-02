<template>
    <div :class="[_tobogPrefix_]" :data-vue-module="$options.name">
        <slot name="prefix" />
        <div :class="[_tobogPrefix_ + '-inner']" ref="virtuallist">
            <div :style="getTransferStyle">
                <slot></slot>
            </div>
        </div>
        <slot name="suffix" />
    </div>
</template>
<script>
import {PerformanceScroll} from "../../utils/dom"
// Virtuallist 虚拟列表
export default {
    name: "Virtuallist",
    props: {
        baseSize: {
            type: Number,
            default: 20,
        },
        total: {
            type: Number,
            default: 0,
        },
        performance: {
            type: String,
            default: "auto",
        },
        cellSelector: String,
        cellHeight: Number,
        reset: [Number, String],
        element: [String, HTMLElement, Function],
    },
    data() {
        return {
            translateSize: 0,
            sizeLength: this.baseSize * 2,
            sizeIndex: 0,
            // customeEle: false,
        }
    },
    created() {
        this.$emit("on-refresh", {
            index: this.sizeIndex,
            length: 2 * 5 + this.baseSize,
            performance: this.initPerformance,
            translate: this.translateSize,
        })
    },
    mounted() {
        this.init()
    },
    computed: {
        isPerformance() {
            return (this.initPerformance === "middle" || this.initPerformance === "high") && this.baseSize < this.total
        },
        initPerformance() {
            if (this.performance === "auto") {
                if (this.total < 100) return "normal"
                if (this.total < 200) return "middle"
                return "high"
            }
            // 测试用
            // return "high"
            return this.performance
        },
        getTransferStyle() {
            if (!this.isPerformance) return {}
            if (this.translateSize > 0)
                return {
                    transform: `translateY(${this.translateSize}px)`,
                }
            return {}
        },
    },
    methods: {
        init() {
            this.translateSize = 0
            if (this._performanceScroll) {
                this._performanceScroll.reset(true)
                this.initPerformanceScroll()
            } else {
                this.initPerformanceScroll()
            }
        },
        // 性能优化
        initPerformanceScroll(opts = {}) {
            if (!this._performanceScroll && this.initPerformance !== "middle" && this.initPerformance !== "high") return
            this.$nextTick(() => {
                const el = this.$refs.virtuallist
                if (el) {
                    opts = {
                        performance: this.initPerformance,
                        beforeScroll: () => this.isPerformance || this.sizeIndex < this.total,
                        length: this.baseSize,
                        total: this.total,
                        cellElement: this.cellSelector || "div>*",
                        cellHeight: this.cellHeight,
                        ...opts,
                    }
                    if (this._performanceScroll) {
                        this._performanceScroll.update(el, opts)
                        return
                    }
                    this._performanceScroll = new PerformanceScroll(el, opts, ({index, translate, length}, type) => {
                        if (type === "over") return
                        // console.log(index, translate, length, this.total, "============")
                        this.sizeIndex = index + length > this.total ? this.total - length + 1 : index
                        if (this.sizeIndex < 0) this.sizeIndex = 0
                        this.sizeLength = length
                        this.translateSize = translate
                        this.$emit("on-refresh", {
                            index: this.sizeIndex,
                            length: this.sizeLength,
                            performance: this.initPerformance,
                            translate: this.translateSize,
                        })
                    })
                }
            })
        },
    },
    watch: {
        reset() {
            this.init()
        },
        total() {
            this.init()
        },
        initPerformance() {
            this.initPerformanceScroll()
        },
    },
    beforeDestroy() {
        this._performanceScroll && this._performanceScroll.destroy()
        this._performanceScroll = null
    },
}
</script>
