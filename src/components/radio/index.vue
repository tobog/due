
<template>
	<section :class="wrapClasses" :data-vview-module="$options.name">
		<slot name="left"></slot>
		<div :class="radioClasses" :style="handleStyle">
			<slot name="content" :active="checked">
				<span :class="_tobogPrefix_+'-inner'"></span>
			</slot>
			<input
				type="radio"
				ref="radio"
				:class="_tobogPrefix_+'-input'"
				:disabled="disabled"
				:readonly="readonly"
				:value="trueValue"
				:id="forUid"
				@change="handleChange"
				v-model="model"
				v-bind="$attrs"
			>
		</div>
		<label v-if="showLabel" :for="forUid" :class="labelClasses">
			<slot>{{ label }}</slot>
		</label>
	</section>
</template>

<script>
import emitter from '../../utils/emitter';
export default {
	name: 'Radio',
	inheritAttrs: false,
	mixins: [emitter],
	props: {
		value: {
			type: [String, Number, Boolean],
			default: false
		},
		trueValue: {
			type: [String, Number, Boolean],
			default: true
		},
		falseValue: {
			type: [String, Number, Boolean],
			default: false
		},
		label: [String, Number],
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		strict: {
			type: Boolean,
			default: true
		},
		size: {
			type: [String, Number],
			// default: 14
		}
	},
	data() {
		return {
			model: this.value,
			forUid: 'Radio' + this._uid,
		};
	},
	created() {
		this.handleDispatch('on-change', this.model);
	},
	watch: {
		value: {
			deep: true,
			handler(val) {
				this.model = val;
			},
		},
		model: {
			deep: true,
			handler(val) {
				this.handleDispatch('on-change', val);
				this.handleDispatch('on-validate', val);
				this.$emit('input', val);
			},
		}
	},
	computed: {
		isReadonly() {
			return this.disabled || this.readonly
		},
		showLabel() {
			return this.$slots.default || (this.label !== undefined && this.label !== '')
		},
		checked() {
			return this.strict ? this.model === this.trueValue : this.model == this.trueValue;
		},
		handleStyle() {
			let size = this.size, result;
			switch (size) {
				case 'small': size = 12; break;
				case '':
				case 'default': size = 14; break;
				case 'large': size = 16; break;
				case 'auto': size = false; break;
				default: size = 16; break;
			}
			result = `${size}px`;
			return size ? {
				width: result,
				height: result,
			} : null
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrap`,
				{
					[`${_tobogPrefix_}-disabled`]: this.disabled,
				},
			];
		},
		labelClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_ + '-slot',
				{
					[`${_tobogPrefix_}-readonly`]: this.readonly,
				}]
		},
		radioClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-checked`]: this.checked,
					[`${_tobogPrefix_}-readonly`]: this.readonly,
				},
			];
		},
	},
	methods: {
		handleChange(event) {
			this.$emit('on-change', this.model, event);
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},
	},
};
</script>


