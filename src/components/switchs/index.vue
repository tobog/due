
<template>
	<section
		:class="classes"
		:data-vview-module="$options.name"
		:style="handleStyle"
		@click.stop="toggle"
		@keydown.space="toggle"
	>
		<input type="hidden" :name="name" :value="value">
		<div :class="_tobogPrefix_+'-inner'">
			<slot name="open"></slot>
			<slot name="close"></slot>
		</div>
	</section>
</template>

<script>
import emitter from '../../utils/emitter';
export default {
	name: 'Switchs',
	mixins: [emitter],
	props: {
		name: String,
		value: {
			type: [Boolean, String],
			default: false,
		},
		trueValue: {
			type: [Boolean, String],
			default: true,
		},
		falseValue: {
			type: [Boolean, String],
			default: false,
		},
		size: {
			type: [String, Number],
			// default: 14
		},
		disabled: {
			type: Boolean,
			default: false
		},
		strict: {
			type: Boolean,
			default: true
		},

	},
	data() {
		return {
			model: this.value,
		};
	},
	created() {
		this.handleDispatch('on-change', this.model, this.handleCheck);
	},
	computed: {
		handleCheck() {
			return this.strict ? this.model === this.trueValue : this.value == this.trueValue
		},
		handleStyle() {
			let size = this.size, result;
			switch (size) {
				case 'small': size = 12; break;
				case 'default': size = 14; break;
				case 'large': size = 16; break;
			}
			result = `${size}px`;
			return size ? {
				width: `${size * 2}px`,
				height: result,
				fontSize: `${size / 2}px`,
			} : null
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-checked`]: this.handleCheck,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
				},
			];
		},
	},
	methods: {
		toggle(event) {
			if (this.disabled) return false;
			const value = this.handleCheck ? this.falseValue : this.trueValue;
			this.model = value;
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},
	},
	watch: {
		value(val) {
			this.model = val;
		},
		model(val) {
			const bool = this.handleCheck;
			this.$emit('input', val);
			this.$emit('on-change', val, bool);
			this.handleDispatch('on-change', val, bool);
		}
	},
};
</script>


