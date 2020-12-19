<template>
	<div :class="wrapClasses" :style="handleStyle()">
		<slot></slot>
	</div>
</template>
<script>
	import { parseNumber } from "../../utils/tool";
	import { findBrothersComponents } from "../../utils/findComponent";
	export default {
		name: "Layout-Header",
		props: {
			fixed: {
				type: Boolean,
				default: true
			},
			height: {
				type: Number,
				default: 64
			},
			isBottom: Boolean,
			insideMode:Boolean
		},
		computed: {
			wrapClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					_tobogPrefix_,
					{
						[`${_tobogPrefix_}-fixed`]: !!this.fixed
					}
				];
			}
		},
		methods: {
			getBrotherSliders() {
				return findBrothersComponents(this, "Layout-Slider");
			},
			handleStyle() {
				const height = parseNumber(this.height);
				const sliders = this.getBrotherSliders();
				const style = {};
				if (height != 64) style.height = height + "px";
				if (sliders.length == 0) return style;
				let widthLeft = 0,
					widthRight = 0;
				sliders.forEach(item => {
					if (item.fixed) {
						if (item.isRight) {
							widthRight += parseNumber(item.width);
						} else {
							widthLeft += parseNumber(item.width);
						}
					}
				});
				if (!this.fixed) {
					if (widthLeft) style.paddingLeft = widthLeft + "px";
					if (widthRight) style.paddingRight = widthRight + "px";
					return style;
				}
				if (this.insideMode) {
					if (widthLeft) style.left = widthLeft + "px";
					if (widthRight) style.right = widthRight + "px";
					return style;
				}
				return style;
			}
		}
	};
</script>