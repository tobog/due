<template>
    <section :class="classes" :data-vue-module="$options.name">
        <svg
            viewBox="0 0 100 100"
            :style="circleSize"
            :class="[_tobogPrefix_ + '-svg']"
            fill-opacity="0"
            v-bind="$attrs"
        >
            <circle
                :class="[_tobogPrefix_ + '-hide-bar']"
                transform-origin="center center 0"
                :r="radius"
                cx="50"
                cy="50"
                :style="getStrokeDash"
            />
            <circle
                :class="[_tobogPrefix_ + '-bar']"
                :r="radius"
                transform-origin="center center 0"
                cx="50"
                cy="50"
                :style="handleStyle"
            />
            <slot name="svg" />
        </svg>
        <div :class="[_tobogPrefix_ + '-inner']">
            <slot>
                <vIcon
                    v-if="_statusIcons[status]"
                    :data-inner-icon="_statusIcons[status]"
                    :type="_statusIcons[status]"
                    :style="{ color: getStrokeColor }"
                ></vIcon>
            </slot>
        </div>
        <input type="hidden" v-if="name || name == '0'" :name="name" :value="percent" />
    </section>
</template>
<script>
import { unit, isParseNumber } from "../../../utils/tool";
import globalMixin from "../../../mixins/global";
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
            // default: "#2db7f5",
        },
        trackWidth: {
            type: Number,
            default: 5,
        },
        trackColor: {
            type: String,
            // default: "#eaeef2",
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
        status: String,
    },
    created() {
        this._statusIcons = {
            success: "ios-checkmark",
            warning: "ios-alert",
            error: "ios-close",
        };
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size");
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                    [`${_tobogPrefix_}-theme-${this.status}`]: this.status,
                },
            ];
        },
        getStrokeColor() {
            if (Array.isArray(this.strokeColor)) {
                const data = this.strokeColor.find((item) => {
                    return this.percent < item.percent;
                });
                return (data && data.color) || this.strokeColor;
            }
            return this.strokeColor;
        },
        getStrokeDash() {
            if (this.dashboard) {
                const length = this.len / this.getRadix;
                return {
                    strokeDasharray: `${length * 0.8},${length}`,
                    transform: `rotate(126deg)`,
                };
            }
            return {};
        },
        handleStyle() {
            return {
                strokeWidth: unit(this.strokeWidth),
                stroke: this.getStrokeColor,
                strokeDasharray: this.handleDasharray,
                transition: "all 1s linear",
                transform: this.dashboard ? "rotate(-234deg)" : "rotate(-90deg)",
            };
        },
        handleDasharray() {
            const len = this.len;
            let percent = (this.percent / 100) * len;
            percent = percent > len ? len : percent;
            return `${percent} ${len / this.getRadix}`;
        },
        circleSize() {
            let style = {
                stroke: this.trackColor,
                strokeWidth: this.trackWidth,
                strokeLinecap: this.strokeLinecap,
            };
            if (isParseNumber(this.size)) {
                style.width = style.height = unit(this.size, "px");
            }
            return style;
        },
        radius() {
            return 50 - this.strokeWidth / 2;
        },
        getRadix() {
            return this.dashboard ? 0.8 : 1;
        },
        len() {
            return Math.PI * 2 * this.radius * this.getRadix;
        },
    },
};
</script>
