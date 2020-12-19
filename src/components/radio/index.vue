
<template>
	<section :class="wrapClasses" :data-vue-module="$options.name" tabindex="1" @click="toggle">
		<slot name="prefix"></slot>
		<slot name="content" :isChecked="isChecked">
			<span :class="[_tobogPrefix_ + '-inner']" :style="getSizeStyle"></span>
		</slot>
		<span v-if="showLabel" :class="[_tobogPrefix_ + '-label']">
			<slot>{{ label }}</slot>
		</span>
		<input
			type="radio"
			ref="radio"
			:class="[_tobogPrefix_+'-input']"
			:disabled="disabled"
			:readonly="readonly"
			:value="trueValue"
			:name="name"
			@change="handleChange"
			v-model="model"
			v-bind="$attrs"
		/>
	</section>
</template>

<script>
import emitter from '../../utils/emitter';
import { unit, validVal } from '../../utils/tool'
export default {
	name: 'Radio',
	inheritAttrs: false,
	mixins: [emitter],
	props: {
		name: String,
		value: {
			type: [String, Number, Boolean],
			default: false
		},
		trueValue: {
			type: [String, Number, Boolean],
			default: true
		},
		// falseValue: [String, Number, Boolean],
		label: String,
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
			default: false
		},
		size: {
			type: [String, Number],
			// default: "default"
		},
		theme: String,
	},
	data() {
		return {
			model: this.value,
		};
	},
	created() {
		this.handleDispatch('on-change', this.model);
	},
	watch: {
		value: {
			deep: true,
			handler(val) {
				if (val === this.model) return;
				this.model = val;
			},
		},
		model: {
			deep: true,
			handler(val) {
				// this.$emit('input', val);
				this.handleDispatch('on-change', val);
				this.handleDispatch('on-validate', val);
			},
		}
	},
	computed: {
		showLabel() {
			return this.$slots.default || validVal(this.label);
		},
		isChecked() {
			return this.strict ? this.model === this.trueValue : this.model == this.trueValue;
		},
		getSizeStyle() {
			let size = this.size || 14,
				result;
			switch (size) {
				case "small":
					size = 12;
					break;
				case "default":
					size = 14;
					break;
				case "large":
					size = 16;
					break;
				case "auto":
					size = "";
					break;
			}
			result = unit(size, 'px');
			return size
				? {
					width: result,
					height: result,
				}
				: null;
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-checked`]: this.isChecked,
					[`${_tobogPrefix_}-readonly`]: this.readonly,
					[`${_tobogPrefix_}-disabled`]: this.disabled
				}
			];
		},
	},
	methods: {
		toggle() {
			if (this.disabled || this.readonly) return;
			this.$refs.radio.click();
		},
		handleChange(event) {
			// console.log(this.model, 'this.model')
			this.$emit("input", this.model);
			this.$emit("on-change", this.model, event);
			this.handleDispatch("on-validate", this.model);
		},
		handleDispatch(...args) {
			if (this.__parentComponent__) {
				this.__parentComponent__.$emit(...args)
			} else {
				this.__parentComponent__ = this.dispatch('FormItem', ...args)
			}
		},
	},
};
</script>


