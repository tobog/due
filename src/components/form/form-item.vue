<template>
	<section :class="classes" :data-vview-module="$options.name">
		<aside :style="labelStyles" :class="[_tobogPrefix_ + '-label-wrapper']" ref="label">
			<label v-if="showLabel" :for="forUid" :class="_tobogPrefix_ + '-label'">
				<slot name="label">{{ label }}</slot>
			</label>
		</aside>
		<div :style="contentStyles()" :class="[_tobogPrefix_ + '-content']" :id="forUid" v-if="ready">
			<slot></slot>
		</div>
		<footer :style="contentStyles()" :class="[_tobogPrefix_ + '-tipwrap']" v-if="error||tip">
			<div :class="tipClasses" v-html="error||tip"></div>
		</footer>
	</section>
</template>

<script>
import AsyncValidator from 'async-validator';
import { findComponentUpward } from '../../utils/findComponent';
import { debounce } from '../../utils/tool';
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
		value: {
			default: undefined
		},
	},
	data() {
		return {
			error: '',
			ready: false,
			forUid: 'FormItem' + this._uid,
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
	mounted() {
		this.ready = true;
	},
	computed: {
		showLabel() {
			const width = this.getLabelWidth;
			return width != '0' && (this.label !== undefined || !!this.$slots.label)
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				'vview-clearfix',
				{
					[`${_tobogPrefix_}-required`]: this.isRequired,
					[`${_tobogPrefix_}-error`]: !!this.error,
					[`${_tobogPrefix_}-inline`]: this.inline || this.Form.inline,
				},
			];
		},
		tipClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-tip`,
				{
					[`${_tobogPrefix_}-error-tip`]: !!this.error,
				},
			];
		},
		getLabelWidth() {
			const ready = this.ready, labelWidth = this.labelWidth;
			return (labelWidth !== undefined && labelWidth !== "") ? labelWidth : this.Form.labelWidth
		},
		labelStyles() {
			if (!this.ready) return;
			let width = this.getLabelWidth,
				align = this.align || this.Form.align;
			if (width === 'auto') {
				return {
					textAlign: align || 'right',
				};
			}
			if (width !== undefined && width !== "") {
				return {
					width: `${width}px`,
					textAlign: align || 'right',

				};
			}
			return {
				lineHeight: "normal",
				height: 'unset',
				float: 'unset',
				display: 'block',
				padding: '3px',
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
		contentStyles() {
			if (!this.ready) return;
			let width = this.getLabelWidth;
			if (width == '0') return { display: 'block' }
			if (width === 'auto') {
				return { marginLeft: (this.$refs.label || {}).offsetWidth + 1 + 'px' };
			}
			if (width !== undefined && width !== "") {
				return { marginLeft: `${width}px` };
			}
			return { display: 'block' };
		},
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
