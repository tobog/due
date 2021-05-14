<template>
    <section :class="classes" :data-vue-module="$options.name">
        <svg
            viewBox="0 0 100 100"
            :style="circleSize"
            :stroke="trackColor"
            :stroke-width="trackWidth"
            :stroke-linecap="strokeLinecap"
            :class="[_tobogPrefix_ + '-svg']"
            fill-opacity="0"
            v-bind="$attrs"
        >
            <circle transform-origin="center center 0" :r="radius" cx="50" cy="50" :style="getStrokeDash" />
            <circle
                :r="radius"
                transform-origin="center center 0"
                cx="50"
                cy="50"
                :stroke="getStrokeColor"
                :stroke-width="strokeWidth"
                :style="handleStyle"
            />
            <slot name="svg" />
        </svg>
        <div :class="[_tobogPrefix_ + '-inner']">
            <slot></slot>
        </div>
        <input type="hidden" v-if="name || name == '0'" :name="name" :value="percent" />
    </section>
</template>
<script>
import {unit, isParseNumber} from "../../utils/tool"
import globalMixin from "../../mixins/global"
export default {
    name: "CircleCard",
    componentName: "CircleCard",
    mixins: [globalMixin],
    inheritAttrs: false,
    props: {
        name: String,
        percent: {
            type: Number,
            default: 0,
        },
        size: {
            type: Number,
            default: 120,
        },
        strokeWidth: {
            type: Number,
            default: 6,
        },
        strokeColor: {
            type: [String, Array],
            default: "#2db7f5",
        },
        trackWidth: {
            type: Number,
            default: 5,
        },
        trackColor: {
            type: String,
            default: "#eaeef2",
        },
        dashboard: {
            type: Boolean,
            default: false,
        },
        strokeLinecap: {
            // ['square', 'round', 'butt', 'inherit']
            // validator(value) {
            // 	return oneOf(value, ['square', 'round', 'butt', 'inherit']);
            // },
            default: "round",
        },
    },

    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size")
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                },
            ]
        },
        getStrokeColor() {
            if (Array.isArray(this.strokeColor)) {
                const data = this.strokeColor.find((item) => {
                    return this.percent < item.percent
                })
                return (data && data.color) || this.strokeColor;
            }
            return this.strokeColor
        },
        getStrokeDash() {
            if (this.dashboard) {
                const length = this.len / this.getRadix
                return {
                    strokeDasharray: `${length * 0.8},${length}`,
                    transform: `rotate(126deg)`,
                }
            }
            return {}
        },
        handleStyle() {
            return {
                strokeDasharray: this.handleDasharray,
                transition: "all 1s linear",
                transform: this.dashboard ? "rotate(-234deg)" : "rotate(-90deg)",
            }
        },
        handleDasharray() {
            const len = this.len
            let percent = (this.percent / 100) * len
            percent = percent > len ? len : percent
            return `${percent} ${len / this.getRadix}`
        },
        circleSize() {
            if (isParseNumber(this.size)) {
                const size = unit(this.size, "px")
                return {
                    width: size,
                    height: size,
                }
            }
            return {}
        },
        radius() {
            return 50 - this.strokeWidth / 2
        },
        getRadix() {
            return this.dashboard ? 0.8 : 1
        },
        len() {
            return Math.PI * 2 * this.radius * this.getRadix
        },
    },
}
</script>
