
<template>
	<section :class="[_tobogPrefix_]" :data-vue-module="$options.name">
		<svg
			viewBox="0 0 100 100"
			:style="circleSize"
			:stroke="trackColor"
			:stroke-width="trackWidth"
			:stroke-linecap="strokeLinecap"
			fill-opacity="0"
			v-bind="$attrs"
		>
			<circle transform-origin="center center 0" :r="radius" cx="50" cy="50" :style="getStrokeDash" />
			<circle
				:r="radius"
				transform-origin="center center 0"
				cx="50"
				cy="50"
				:stroke="strokeColor"
				:stroke-width="strokeWidth"
				:style="handleStyle"
			/>
			<slot name="svg" />
		</svg>
		<!-- <input type="hidden"  v-if="name||name=='0'" :name="name" :value="percent" /> -->
		<div :class="[_tobogPrefix_ + '-inner']">
			<slot></slot>
		</div>
	</section>
</template>
<script>
import { unit } from '../../utils/tool'
export default {
	name: "SvgCircle",
	inheritAttrs: false,
	props: {
		name: String,
		percent: {
			type: Number,
			default: 0
		},
		size: {
			type: Number,
			default: 120
		},
		strokeWidth: {
			type: Number,
			default: 6
		},
		strokeColor: {
			type: String,
			default: "#2db7f5"
		},
		trackWidth: {
			type: Number,
			default: 5
		},
		trackColor: {
			type: String,
			default: "#eaeef2"
		},
		dashboard: {
			type: Boolean,
			default: false
		},
		strokeLinecap: {
			// ['square', 'round', 'butt', 'inherit']
			// validator(value) {
			// 	return oneOf(value, ['square', 'round', 'butt', 'inherit']);
			// },
			default: "round"
		}
	},

	computed: {
		getStrokeDash() {
			if (this.dashboard) {
				const length = this.len / this.getRadix;
				return {
					'stroke-dasharray': `${length * 0.8},${length}`,
					'transform': `rotate(126deg)`
				}
			}
		},
		handleStyle() {
			return {
				strokeDasharray: this.handleDasharray,
				transition: "all 1s linear",
				transform: this.dashboard ? "rotate(-234deg)" : "rotate(-90deg)",
			};
		},
		handleDasharray() {
			const len = this.len;
			let percent = (this.percent / 100) * len
			percent = percent > len ? len : percent;
			return `${percent} ${len / this.getRadix}`;
		},
		circleSize() {
			const size = unit(this.size, 'px')
			return {
				width: size,
				height: size
			};
		},
		radius() {
			return 50 - this.strokeWidth / 2;
		},
		getRadix() {
			return this.dashboard ? 0.8 : 1
		},
		len() {
			return Math.PI * 2 * this.radius * this.getRadix;
		}
	}
};
</script>
