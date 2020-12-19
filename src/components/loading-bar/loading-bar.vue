
<template>
	<section :class="[_tobogPrefix_]">
		<div :style="styles" :class="innerClasses"></div>
	</section>
</template>
<script>
import { unit } from "../../utils/tool";
export default {
	name: "LoadingBar",
	props: {
		color: {
			type: String,
			default: "success"
		},
		failColor: {
			type: String,
			default: "error"
		},
		height: {
			type: Number,
			default: 3
		}
		// config: Object
	},
	data() {
		return {
			percent: 0,
			status: "",
			visible: true,
			...this.$attrs
		};
	},
	computed: {
		styles() {
			return {
				backgroundColor: this.getColor,
				height: this.getHeight,
				width: this.getPercent
			};
		},
		getPercent() {
			return unit(this.percent, "%");
		},
		getColor() {
			if (this.failColor && this.status === "error") {
				return this.failColor;
			}
			return this.color;
		},
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-error`]: this.status === "error",
					[`${_tobogPrefix_}-success`]: this.status === "success"
				}
			];
		},
		getHeight() {
			return unit(this.height);
		}
	}
};
</script>
