<template>
	<div :class="wrapClasses" :style="handleStyle()">
		<slot></slot>
	</div>
</template>
<script>
	import { parseNumber } from "../../utils/tool";
	import { findBrothersComponents } from "../../utils/findComponent";
	export default {
		name: "Layout-Slider",
		props: {
			fixed: {
				type: Boolean,
				default: true
			},
			width: {
				type: Number,
				default: 200
			},
			isRight: Boolean
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
			getBrotherHeaders() {
				return findBrothersComponents(this, "Layout-Header");
			},
			handleStyle() {
				const width = parseNumber(this.width);
				const headers = this.getBrotherHeaders();
				const style = {};
				if (width != 200) style.width = width + "px";
				if (headers.length == 0) return style;
				let heightTop = 0,
					heightBottom = 0;
				headers.forEach(item => {
					if (item.fixed && !item.insideMode) {
						if (item.isBottom) {
							heightBottom += parseNumber(item.height);
						} else {
							heightTop += parseNumber(item.height);
						}
					}
				});
				if (heightTop) style.top = heightTop + "px";
				if (heightBottom) style.bottom = heightBottom + "px";
				return style;
			}
		}
	};
</script>