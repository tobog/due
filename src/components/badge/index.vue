<template>
	<section :class="[_tobogPrefix_]" :data-vview-module="$options.name">
		<slot />
		<span v-if="visible" :class="labelClasses" :style="labelOffset">
			<slot name="label">{{ format(label,overLabel) }}</slot>
		</span>
	</section>
</template>

<script>
export default {
	name: 'Badge',
	props: {
		label: [Number, String],
		offset: Array,
		type: String, //success、primary、default、error、warning、info
		progress: Boolean,
		overLabel: {
			type: Number,
			default: 99
		},
		visible: {
			type: Boolean,
			default: true,
		},
		format: {
			type: Function,
			default(label, overLabel) {
				return parseInt(label) >= parseInt(overLabel) ? `${overLabel}+` : label;
			}
		}
	},
	computed: {
		labelClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-base`,
				{
					[`${_tobogPrefix_}-label`]: this.labelSlot,
					[`${_tobogPrefix_}-only`]: this.defaultSlot,
					[`${_tobogPrefix_}-${this.type}`]: !!this.type,
					[`${_tobogPrefix_}-progress`]: this.progress,
				}
			];
		},
		labelOffset() {
			const offset = this.offset || [],
				style = {};
			if (offset[0]) style.top = offset[0];
			if (offset[1]) style.right = offset[1];
			return style;
		},
		labelSlot() {
			return this.label !== undefined || this.$slots.label !== undefined;
		},
		defaultSlot() {
			return this.$slots.default === undefined;
		},
	}
};
</script>
