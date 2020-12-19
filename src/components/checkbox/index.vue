
<template>
	<section
		:class="wrapClasses"
		:data-vue-module="$options.name"
		tabindex="1"
		@click="toggle"
		@keydown.enter="toggle"
	>
		<slot name="prefix"></slot>
		<slot name="content" :checked="isChecked">
			<span :class="[_tobogPrefix_ + '-inner']" :style="getSizeStyle">
				<template v-if="!radio">
					<Icons v-if="indeterminate" type="remove" center />
					<Icons v-else :type="trueIcon || 'checkmark'" center />
				</template>
			</span>
		</slot>
		<span v-if="showLabel" :class="[_tobogPrefix_ + '-label']">
			<slot>{{ label }}</slot>
		</span>
		<input
			ref="input"
			type="checkbox"
			:value="trueValue"
			:true-value="trueValue"
			:false-value="falseValue"
			:readonly="readonly"
			:disabled="disabled"
			:class="[_tobogPrefix_ + '-input']"
			:name="name"
			@change="handleChange"
			v-model="model"
		/>
	</section>
</template>

<script>
	import emitter from "../../utils/emitter";
	import Icons from "../icons/index";
	import { unit, validVal } from "../../utils/tool";
	export default {
		name: "CheckBox",
		components: { Icons },
		mixins: [emitter],
		props: {
			name: String,
			label: String,
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
			border: {
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
				default: "default"
			},
			radio: {
				type: Boolean,
				default: false
			},
			reverse: {
				type: Boolean,
				default: false
			},
			theme: String,
			trueIcon: String
		},
		data() {
			return {
				model: this.falseValue === undefined ? this.value : `${this.value}`
			};
		},
		created() {
			this.handleDispatch("on-change", this.model);
		},
		watch: {
			value: {
				deep: true,
				handler(val) {
					if (val === this.model) return;
					this.model = val;
				}
			},
			model: {
				deep: true,
				handler(val, old) {
					this.$emit("input", val);
					this.handleDispatch("on-change", val);
					this.handleDispatch("on-validate", val);
				}
			}
		},
		computed: {
			showLabel() {
				return this.$slots.default || validVal(this.label);
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
				result = unit(size, "px");
				return size
					? {
							width: result,
							height: result,
							fontSize: `${size * 0.9}px`
					  }
					: null;
			},
			wrapClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					_tobogPrefix_,
					{
						[`${_tobogPrefix_}-radio`]: this.radio,
						[`${_tobogPrefix_}-border`]: this.border,
						[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
						[`${_tobogPrefix_}-checked`]: this.isChecked,
						[`${_tobogPrefix_}-indeterminate`]: this.indeterminate,
						[`${_tobogPrefix_}-readonly`]: this.readonly,
						[`${_tobogPrefix_}-disabled`]: this.disabled
					}
				];
			},
			isChecked() {
				const val = this.model,
					trueValue = this.trueValue,
					bool = Array.isArray(val);
				let checked;
				if (this.strict) {
					checked = bool
						? val.indexOf(trueValue) > -1
						: val === trueValue;
				} else {
					checked = bool
						? val.some(item => {
								return item == trueValue;
						  })
						: val == trueValue;
				}
				return this.reverse ? !checked : checked;
			}
		},
		methods: {
			toggle() {
				if (this.disabled || this.readonly) return;
				this.$refs.input.click();
			},
			handleChange(event) {
				this.$emit("input", this.model);
				this.$emit("on-change", this.model, event);
				this.handleDispatch("on-validate", this.model);
			},
			handleDispatch(...args) {
				if (this.__parentComponent__) {
					this.__parentComponent__.$emit(...args);
				} else {
					this.__parentComponent__ = this.dispatch("FormItem", ...args);
				}
			}
		}
	};
</script>

