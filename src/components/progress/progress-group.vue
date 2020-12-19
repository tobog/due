

<template>
	<div :class="wrapClasses" :data-vview-module="$options.name" :style="bgStyle">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'ProgressGroup',
	props: {
		vertical: Boolean,
		strokeWidth: {
			type: [Number, String],
			default: 10,
		},
	},
	mounted() {
		this.updateChildren();
	},
	methods: {
		updateChildren() {
			let percent = 0
			this.$children.forEach(element => {
				element.group = true;
				element.percentinner = percent;
				percent += element.percent;
			});
		}
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-vertical`]: this.vertical,
				},
			];
		},
		bgStyle() {
			return this.vertical
				? {
					width: `${this.strokeWidth}px`,
				}
				: {
					height: `${this.strokeWidth}px`,
				};
		},
	},
};
</script>
