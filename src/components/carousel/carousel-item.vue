<template>
	<div :class="_tobogPrefix_" :style="styles">
		<slot></slot>
	</div>
</template>
<script>

export default {
	name: 'CarouselItem',
	props: {
		height: {
			type: [String, Number],
			default: '100%',
		}
	},
	data() {
		return {
			width: '',
		}
	},
	computed: {
		getHeight() {
			let height = `${this.height}`;
			height = height.indexOf("%") > -1 ? height : parseInt(height);
			height = height > 0 ? (height + 'px') : '';
			return height;
		},
		styles() {
			return {
				width: this.width,
				height: this.getHeight
			}
		}
	},
	created() {
		this.$parent.updateChildren();
	},
	watch: {
		width(val) {
			if (val && this.$parent.loop) {
				this.$parent.initCopyDom();
			}
		},
	},
	beforeDestroy() {
		this.$parent.updateChildren();
	}
};
</script>
