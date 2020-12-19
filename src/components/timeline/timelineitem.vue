<template>
	<li :class="[_tobogPrefix_]">
		<div :class="[_tobogPrefix_+'-tail']"></div>
		<div :class="headClasses" :style="customStyle">
			<slot name="dot"></slot>
		</div>
		<div :class="[_tobogPrefix_+'-content']">
			<slot></slot>
		</div>
	</li>
</template>
<script>

export default {
	name: 'TimelineItem',
	props: {
		theme: {
			type: String,
			default: 'primary'
		},
		color: String
	},
	computed: {
		headClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-head`,
				{
					[`${_tobogPrefix_}-head-custom`]: !!this.$slots.dot,
					[`${_tobogPrefix_}-head-${this.theme}`]: !!this.theme
				}
			];
		},
		customStyle() {
			if (this.color) {
				return {
					'color': this.color,
					'border-color': this.color
				};
			}
		},
	}
};
</script>
