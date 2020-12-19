
<template>
	<section :class="wrapClasses" :data-vview-module="$options.name">
		<slot name="prefix"></slot>
		<div :class="outerClasses" :style="handleStyle">
			<slot name="content" :active="checked">
				<span :class="_tobogPrefix_+'-inner'">
					<template v-if="!radio">
						<Icons type="remove" v-if="indeterminate" />
						<Icons type="checkmark" v-else />
					</template>
				</span>
			</slot>
			<input
				ref="checkbox"
				type="checkbox"
				:value="trueValue"
				:true-value="trueValue"
				:false-value="falseValue"
				:class="_tobogPrefix_+'-input'"
				:disabled="disabled"
				:readonly="readonly"
				:name="name"
				:id="forUid"
				@change="handleChange"
				v-model="model"
			/>
		</div>
		<label :for="forUid" v-if="showLabel" :class="labelClasses">
			<slot>{{label}}</slot>
		</label>
	</section>
</template>

<script>
import emitter from '../../utils/emitter';
import Icons from '../icons/index';

export default {
	name: 'CheckBox',
	components: { Icons },
	mixins: [emitter],
	props: {
		name: String,
		label: [String],
		value: {
			type: [String, Number, Boolean, Array],
			default: false
		},
		trueValue: {
			type: [String, Number, Boolean],
			default: true
		},
		falseValue: {
			type: [String, Number, Boolean],
			default: undefined
		},
		indeterminate: {
			type: Boolean,
			default: false
		},
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
			default: 'default',
		},
		radio: {
			type: Boolean,
			default: false
		},
		reverse: Boolean
	},
	data() {
		return {
			model: this.falseValue === undefined ? this.value : `${this.value}`,
			forUid: 'CheckBox' + this._uid,
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
			handler(val, old) {
				this.$emit('input', val);
				this.handleDispatch('on-change', val);
				this.handleDispatch('on-validate', val);
			},
		}
	},
	computed: {
		showLabel() {
			return this.$slots.default || (this.label !== undefined && this.label !== '')
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
				fontSize: `${size * 0.9}px`,
			} : null
		},
		labelClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_ + '-slot',
				{
					[`${_tobogPrefix_}-readonly`]: this.readonly,
				}]
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [`${_tobogPrefix_}-wrap`, {
				[`${_tobogPrefix_}-disabled`]: this.disabled,
			}]
		},
		outerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}`,
				{
					[`${_tobogPrefix_}-radio`]: this.radio,
					[`${_tobogPrefix_}-checked`]: this.checked,
					[`${_tobogPrefix_}-indeterminate`]: this.indeterminate,
					[`${_tobogPrefix_}-readonly`]: this.readonly,
				},
			];
		},
		checked() {
			const val = this.model, trueValue = this.trueValue, bool = val instanceof Array;
			if (this.strict) {
				const checked = bool ? val.indexOf(trueValue) > -1 : val === trueValue;
				return this.reverse ? !checked : checked;
			}
			const checked = bool ? val.some((item) => {
				return item == trueValue;
			}) : val == trueValue;
			return this.reverse ? !checked : checked;
		},
	},
	methods: {
		handleChange(event) {
			this.$nextTick(() => {
				this.$emit('on-change', this.model, event);
			});
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

