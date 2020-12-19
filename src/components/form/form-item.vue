<template>
	<section :class="wrapClasses" :data-vue-module="$options.name">
		<div
			v-if="showLabel"
			ref="label"
			:style="labelStyles"
			:class="[_tobogPrefix_ + '-label']"
		>
			<slot name="label">{{ label }}</slot>
		</div>
		<div :class="[_tobogPrefix_ + '-content']">
			<slot></slot>
			<div v-if="error||tip" :class="[_tobogPrefix_ + '-tip-wrap']">
				<div :class="[_tobogPrefix_ + '-tip']" v-html="error||tip"></div>
			</div>
		</div>
	</section>
</template>

<script>
import AsyncValidator from 'async-validator';
import { findComponentUpward } from '../../utils/findComponent';
import { debounce, unit, validVal } from '../../utils/tool';
export default {
	name: 'FormItem',
	props: {
		prop: String,
		labelWidth: [Number, String],
		required: Boolean,
		rules: Array,
		tip: String,
		label: String,
		inline: Boolean,
		align: String,
		vertical: String,
		value: {
			default: undefined
		},
	},
	data() {
		return {
			error: '',
		};
	},
	created() {
		this.Form = findComponentUpward(this, 'Forms') || {};
		if (this.Form.$emit) this.Form.$emit('on-form-item-add', this);
		if (this.prop) {
			this.__debounceValidator = debounce(this.validate);
			this.$on('on-validate', this.__debounceValidator)
			this.$on('on-change', this.handleChange);
		}
	},
	computed: {
		showLabel() {
			const width = this.getLabelWidth;
			return width != '0' && (validVal(this.label) || !!this.$slots.label)
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-required`]: this.isRequired,
					[`${_tobogPrefix_}-vertical-${this.vertical}`]: !!this.vertical,
					[`${_tobogPrefix_}-error`]: !!this.error,
					[`${_tobogPrefix_}-inline`]: this.inline || this.Form.inline,
					[`${_tobogPrefix_}-nowrap`]: validVal(this.getLabelWidth),
				},
			];
		},
		getLabelWidth() {
			const labelWidth = this.labelWidth;
			return validVal(labelWidth) ? labelWidth : this.Form.labelWidth
		},
		labelStyles() {
			let width = this.getLabelWidth,
				align = this.align || this.Form.align;
			if (width === 'auto') {
				return {
					textAlign: align || 'right',
				}
			}
			if (validVal(width)) {
				return {
					width: unit(width),
					textAlign: align || 'right',
				}
			}
			return {
				width: '100%',
				textAlign: align || 'left',
			}
		},
		isRequired() {
			if (!this.prop) return false;
			let isRequired = this.required;
			if (!isRequired) {
				isRequired = this.getRules.some(rule => {
					return rule.required;
				});
			}
			return isRequired;
		},
		getRules() {
			const formRules = this.Form.rules || {};
			const rules = this.rules || formRules[this.prop] || formRules["*"] || [];
			return rules instanceof Array ? rules : [rules];
		},
	},

	methods: {
		handleChange(val) {
			this.__validate__ = true;
			this.getValue(val);
		},
		getValue(val) {
			if (val === undefined) {
				if (this.__validVal__ === undefined || !this.__validate__) return this.__validVal__ = this.value;
				return this.__validVal__;
			}
			return this.__validVal__ = val;
		},
		validate(val, callback) {
			const prop = this.prop, iscb = typeof callback === 'function';
			const rules = (this.isRequired && this.getRules.length == 0) ? [{ required: true }] : this.getRules;
			if (!prop || (!this.__validate__ && this.__validVal__ === undefined) || !rules.length) {
				if (iscb) callback();
				return true;
			}
			const validator = new AsyncValidator({
				[prop]: rules,
			});
			return validator.validate({
				[prop]: this.getValue(val),
			}, errors => {
				this.error = errors ? errors[0].message : null;
				if (iscb) callback(this.error);
			});
		},
		resetValidate() {
			this.error = null;
		},
	},
	beforeDestroy() {
		if (this.Form.$emit) this.Form.$emit('on-form-item-remove', this);
	},
};
</script>
