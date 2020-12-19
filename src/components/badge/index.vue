<template>
	<span :class="[_tobogPrefix_]" :data-vue-module="$options.name">
		<slot></slot>
		<span v-if="showLabel" :class="labelClasses" :style="labelOffset">
			<slot name="label">{{ format(label,overLabel) }}</slot>
		</span>
	</span>
</template>

<script>
import { parseNumber, unit, validVal } from '../../utils/tool';
export default {
	name: 'Badge',
	props: {
		label: Number,
		offset: Array,
		type: String, //success、primary、default、error、warning、info
		progress: Boolean,
		overLabel: {
			type: Number,
			default: 99
		},
		showLabel: {
			type: Boolean,
			default: true,
		},
		format: {
			type: Function,
			default(label, overLabel) {
				return parseNumber(label) >= parseNumber(overLabel) ? `${overLabel}+` : label;
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
			if (!Array.isArray(this.offset)) return;
			const offset = this.offset,
				style = {};
			if (validVal(offset[0])) style.top = unit(offset[0], 'px');
			if (validVal(offset[1])) style.right = unit(offset[1], 'px');
			return style;
		},
		labelSlot() {
			return this.label || this.$slots.label;
		},
		defaultSlot() {
			return !this.$slots.default;
		},
	}
};
</script>
