

<template>
	<section :class="wrapClasses" :style="handleWrapStyles" :data-vview-module="$options.name">
		<aside v-if="prepend" :class="_tobogPrefix_ + '-prepend'">
			<slot name="prepend"></slot>
		</aside>
		<div :class="innerClasses">
			<span v-if="showprefix" :class="_tobogPrefix_ + '-icon'" data-type-icon="prefix" ref="prefix">
				<slot name="prefix">
					<Icons :type="prefix" center />
				</slot>
			</span>
			<span :class="_tobogPrefix_ + '-icon'" data-type-icon="suffix" ref="suffix">
				<slot name="suffix">
					<Icons type="ios-arrow-up" @click.native="handleIconClick('up')" />
					<Icons type="ios-arrow-down" @click.native="handleIconClick('down')" />
				</slot>
			</span>
			<input
				ref="input"
				type="text"
				:value="valueFormat"
				:class="[_tobogPrefix_]"
				:style="handleInputStyle()"
				:disabled="disabled"
				:readonly="readonly"
				:autocomplete="autocomplete"
				data-form="inputnumber"
				@focus="handleFocus"
				@blur="handleBlur"
				@change="handleChange"
				@input="handleChange"
				@keydown.enter="handleKeyEnter"
				v-bind="$attrs"
			/>
			<input type="hidden" :name="name" :value="currentValue" />
		</div>
		<aside v-if="append" :class="_tobogPrefix_ + '-append'">
			<slot name="append"></slot>
		</aside>
	</section>
</template>


<script>
import Icons from '../icons/index';
import Emitter from '../../utils/emitter';

export default {
	name: 'InputNumber',
	inheritAttrs: false,
	mixins: [Emitter],
	components: {
		Icons,
	},
	props: {
		name: String,
		prefix: String,
		value: [Number, String],
		inputStyle: [String, Object],
		formatter: Function,
		parser: Function,
		precision: [Number, String],
		math: String,
		min: [Number, String],
		max: [Number, String],
		width: [Number, String],
		step: [Number, String],
		readonly: Boolean,
		disabled: Boolean,
		autocomplete: {
			type: String,
			default: 'off',
		}
	},
	data() {
		return {
			currentValue: this.pipePrecision(this.value),
			ready: false,
		};
	},
	created() {
		this.isNativeFocus = true
	},
	mounted() {
		this.ready = true;
		this.handleDispatch('on-change', this.precisionValue);
	},
	computed: {
		handleWrapStyles() {
			let width = this.width;
			if (width) {
				width = parseFloat(width) == width ? `${width}px` : width
				return { width }
			}
		},
		precisionValue() {
			const currentValue = Number(this.currentValue);
			if (this.currentValue === '' || isNaN(currentValue)) return '';
			return currentValue;
		},
		valueFormat() {
			if (typeof this.formatter === 'function') return this.formatter(this.precisionValue);
			console.log(this.precisionValue, 'this.precisionValue')
			return this.precisionValue;
		},
		prepend() {
			return !!this.$slots.prepend;
		},
		append() {
			return !!this.$slots.append;
		},
		showprefix() {
			return this.prefix || this.$slots.prefix;
		},
		// inputClasses() {
		// 	return this._tobogPrefix_;
		// },
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-with-prepend`]: this.prepend,
					[`${_tobogPrefix_}-with-append`]: this.append,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
				},
			];
		},
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-readonly`]: this.readonly,
				},
			];
		},

	},
	methods: {
		handleFixStyle(type) {
			const ref = this.$refs[type];
			if (ref) return `${ref.offsetWidth}px`;
			return "";
		},
		handleInputStyle() {
			if (!this.ready) return
			const inputStyle = this.inputStyle || {},
				paddingLeft = this.handleFixStyle('prefix'),
				paddingRight = this.handleFixStyle('suffix');
			if (typeof inputStyle === 'string') {
				return `padding-left:${paddingLeft};padding-right:${paddingLeft};${inputStyle}`
			} else {
				return { paddingLeft, paddingRight, ...inputStyle }
			}
		},
		pipeMath(val) {
			const math = Math[this.math];
			return math ? math(val) : val
		},
		pipePrecision(val) {
			val = this.handleRange(val);
			let value = Number(val);
			if (isNaN(value)) return '';
			value = this.pipeMath(value);
			if (!isNaN(this.precision)) return value.toFixed(this.precision);
			return value;
		},
		handleChange(event) {
			let val = event.target.value.trim(), eventType = event.type,
				isInput = eventType == 'input';
			if (isInput) this.isNativeFocus = false;
			if (typeof this.parser == 'function') val = this.parser(val);
			if (!val && val !== 0) return this.setValue('', event);
			if (isInput && `${val}`.match(/^\-?0?\.?$|\.0*?$/)) return;
			val = Number(val);
			if (!isNaN(val)) {
				if (isInput && this.formatter) return;
				if (!isInput) val = this.pipePrecision(val);
				this.setValue(val, event);
			} else {
				console.log('event.target.value')
				event.target.value = this.precisionValue;
			}
		},
		setValue(val, event) {
			this.currentValue = val;
			this.$nextTick(() => {
				const precisionValue = this.precisionValue;
				this.$emit('input', precisionValue);
				this.handleDispatch('on-change', precisionValue);
				console.log(event.type, 'setValue', this.precisionValue)
				if (event.type == 'change') {
					this.$emit('on-change', precisionValue, event);
					this.isNativeFocus = true;
				}
			});
		},
		handleIconClick(type) {
			const step = Number(this.step), stepInt = isNaN(step) ? 1 : step;
			if (type === 'up') {
				this.currentValue = this.handleRange(this.precisionValue + stepInt)
			}
			if (type === 'down') {
				this.currentValue = this.handleRange(this.precisionValue - stepInt);
			}
			this.currentValue = this.pipePrecision(this.currentValue);
			this.$emit('input', this.precisionValue);
			this.$emit('on-change', this.precisionValue, event);
			this.handleDispatch('on-validate', this.precisionValue);
		},
		handleKeyEnter(event) {
			this.$emit('on-enter', this.precisionValue, event);
		},
		handleFocus(event) {
			if (!this.isNativeFocus) return this.isNativeFocus = true;
			this.$emit('on-focus', this.precisionValue, event);
		},
		handleBlur(event) {
			if (!this.isNativeFocus) {
				console.log(event.type, 'handleBlur-Cancel')
				this.$refs.input.focus();
				return;
			}
			console.log(event.type, 'handleBlur')
			this.$nextTick(() => {
				this.isNativeFocus = true;
				this.$emit('on-blur', this.precisionValue, event);
				this.handleDispatch('on-validate', this.precisionValue);
				event.target.value = this.valueFormat;
			})
		},
		handleRange(val) {
			if (!val && val !== 0) return;
			const min = this.min, max = this.max;
			if ((min || min === 0) && val < min) return min;
			if ((max || max === 0) && val > max) return max;
			return val;
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},
	},
	watch: {
		value(val) {
			this.currentValue = val;
			this.handleDispatch('on-change', this.precisionValue);
		},
	},
};
</script>

