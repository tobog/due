<template>
    <section :class="classes" :style="getStyle" :data-vue-module="$options.name">
        <slot></slot>
    </section>
</template>

<script>
import mediaSize from "../../../mixins/mediaSize"
import {unit} from "../../../utils/tool"
export default {
    name: "Row",
    componentName: "Row",
    mixins: [mediaSize],
    props: {
        grid: {
            type: [Number, String],
            default: 24,
        },
        gutter: {
            type: [Number, String, Array, Object],
            default: 0,
        },
        flex: Boolean,
        align: {
            type: String,
            // default:'top'，top，middle，bottom，stretch
        },
        justify: {
            type: String,
            // default:'start'，center，end，space-around，space-between
        },
        ratio: {
            type: [Number, String, Object],
            default: 0,
        },
    },
    created() {
        this.__applyResize = this.isCustomeGrid
    },
    watch: {
        grid(val) {
            this.__applyResize = this.isCustomeGrid
            if (val != 24 && this._isMounted) {
                this.bindResize()
            } else {
                this.destroyResize()
            }
        },
    },
    computed: {
        isCustomeGrid() {
            return this.grid && this.grid != 24
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-flex`]: this.flex,
                    [`${_tobogPrefix_}-align-${this.align}`]: !!this.align,
                    [`${_tobogPrefix_}-justify-${this.justify}`]: !!this.justify,
                },
            ]
        },
        getRatio() {
            if (this.ratio && this.ratio instanceof Object) {
                return this.ratio[this.getMedia] || 0
            }
            return this.ratio || 0
        },
        getGutter() {
            if (this.gutter && this.gutter instanceof Object && !Array.isArray(this.gutter)) {
                return this.gutter[this.getMedia]
            }
            return this.gutter
        },
        getStyle() {
            let style = {},
                gutter = this.gutter
            if (Array.isArray(gutter)) {
                gutter = gutter[0]
            } else if (gutter && typeof gutter === "object") {
                gutter = gutter[this.getMedia]
                if (Array.isArray(gutter)) {
                    gutter = gutter[0]
                }
            }
            if (gutter && gutter != "0") {
                style.marginLeft = style.marginRight = unit(gutter, -0.5)
            }
            return style
        },
    },
}
</script>
