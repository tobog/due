<template>
	<i :class="classes" :style="styles" :data-vue-module="$options.name" v-on="$listeners">
		<img
			v-if="isHttpIcon"
			:class="[_tobogPrefix_ + '-img']"
			:src="type"
			:alt="type"
			@error="handleError"
		/>
		<slot></slot>
	</i>
</template>

<script>
import { unit } from "../../utils/tool";
export default {
	name: "Icons",
	props: {
		type: String,
		size: [Number, String],
		color: String,
		center: Boolean
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.type}`]: this.type && !this.isHttpIcon,
					[`${_tobogPrefix_}-httpicon`]: this.isHttpIcon,
					[`${_tobogPrefix_}-center`]: this.center
				}
			];
		},
		isHttpIcon() {
			return /^(https?:\/\/|\.?\/|data:image\/)\w+/.test(this.type || "");
		},
		styles() {
			const style = {};
			if (this.size) style["fontSize"] = unit(this.size, 'px');
			if (this.color) style.color = this.color;
			return style;
		}
	},
	methods: {
		handleError(e) {
			this.$emit('on-error', e);
		}
	}
};
</script>
