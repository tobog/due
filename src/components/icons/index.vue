<template>
    <i :class="classes" :style="styles" :data-vview-module='$options.name'>
        <slot></slot>
    </i>
</template>

<script>
export default {
	name: 'Icons',
	props: {
		type: String,
		size: [Number,String],
		color: String,
		center: Boolean
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-base ${_tobogPrefix_}-${this.type}`,
				{
					[`${_tobogPrefix_}-vertical-center`]: this.center
				}
			]
		},
		styles() {
			let style = {};
			if (this.size) style['font-size'] = `${this.size}px`;
			if (this.color) style.color = this.color;
			return style;
		},
	},
};
</script>
