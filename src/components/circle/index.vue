
<template>
	<div :class="_tobogPrefix_" :data-vview-module="$options.name">
		<svg
			viewBox="0 0 100 100"
			:style="circleSize"
			:stroke="trackColor"
			:stroke-width="trackWidth"
			:stroke-linecap="strokeLinecap"
			fill-opacity="0"
			v-bind="$attrs"
		>
			<template v-if="!path">
				<circle :r="radius" cx="50" cy="50" />
				<circle
					:r="radius"
					cx="50"
					cy="50"
					:stroke="strokeColor"
					:stroke-width="strokeWidth"
					:style="handleStyle"
				/>
			</template>
			<template>
				<path :d="path" />
				<path :d="path" :stroke="strokeColor" :stroke-width="strokeWidth" :style="handleStyle" />/>
			</template>
			<slot name="svg" />
		</svg>
		<div :class="_tobogPrefix_+'-inner'">
			<slot></slot>
		</div>
	</div>
</template>
<script>
// import { oneOf } from '../../utils/tool';
export default {
	name: 'CircleBase',
	inheritAttrs: false,
	props: {
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
			type: String,
			default: '#2db7f5',
		},
		trackWidth: {
			type: Number,
			default: 5,
		},
		trackColor: {
			type: String,
			default: '#eaeef2',
		},
		strokeLinecap: {
			// ['square', 'round', 'butt', 'inherit']
			// validator(value) {
			// 	return oneOf(value, ['square', 'round', 'butt', 'inherit']);
			// },
			default: 'round',
		},
		path: String,
		length: Number,
	},

	computed: {
		handleStyle() {
			if (this.path) {
				return {
					strokeDasharray: this.handleDasharray,
					transition: 'all 1s linear',
				};
			} else {
				return {
					strokeDasharray: this.handleDasharray,
					transition: 'all 1s linear',
					transform: 'rotate(-90deg)',
					transformOrigin: ' center center 0',
				};
			}
		},
		handleDasharray() {
			return `${this.percent / 100 * this.len} ${this.len}`;
		},
		circleSize() {
			return {
				width: `${this.size}px`,
				height: `${this.size}px`,
			};
		},
		radius() {
			return 50 - this.strokeWidth / 2;
		},
		len() {
			return !this.path ? Math.PI * 2 * this.radius : Number(this.length) || 100;
		},
	},
};
</script>
