
<template>
	<section
		:class="wrapClasses"
		:data-vue-module="$options.name"
		:style="getSizeStyle"
		@click="toggle"
		@keydown.space="toggle"
	>
		<input
			type="hidden"
			v-if="name || name == '0'"
			:name="name"
			:value="value"
		/>
		<div :class="[_tobogPrefix_ + '-inner']">
			<slot name="open"></slot>
			<slot name="close"></slot>
		</div>
	</section>
</template>

<script>
	import emitter from "../../utils/emitter";
	import { parseNumber } from "../../utils/tool";
	export default {
		name: "Switchs",
		mixins: [emitter],
		props: {
			name: String,
			value: {
				type: [Boolean, String],
				default: false
			},
			trueValue: {
				type: [Boolean, String],
				default: true
			},
			falseValue: {
				type: [Boolean, String],
				default: false
			},
			falseColor: String,
			trueColor: String,
			size: {
				type: [String, Number],
				// default: 22
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
				default: false
			},
			theme: String,
			loading: Boolean,
			beforeChange:Function
		},
		data() {
			return {
				model: this.value
			};
		},
		created() {
			this.handleDispatch("on-change", this.model, this.isChecked);
		},
		computed: {
			isChecked() {
				return this.strict
					? this.model === this.trueValue
					: this.model == this.trueValue;
			},
			getSizeStyle() {
				let size = this.size,
					style = {};
				switch (size) {
					case "small":
						size = 16;
						break;
					case "default":
						size = 22;
						break;
					case "large":
						size = 26;
						break;
				}
				size = parseNumber(size);
				if (size) {
					style.width = `${size * 2}px`;
					style.height = `${size}px`;
					style.fontSize = `${size / 2}px`;
				}
				if (this.falseColor || this.trueColor) {
					style.background = this.isChecked
						? this.trueColor
						: this.falseColor;
				}
				return style;
			},
			wrapClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					_tobogPrefix_,
					{
						[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
						[`${_tobogPrefix_}-readonly`]: this.readonly,
						[`${_tobogPrefix_}-checked`]: this.isChecked,
						[`${_tobogPrefix_}-disabled`]: this.disabled,
						[`${_tobogPrefix_}-loading`]: this.loading
					}
				];
			}
		},
		methods: {
			async toggle(event) {
				// console.log(this.loading);
				if (this.disabled || this.readonly || this.loading) return;
				if(typeof this.beforeChange==='function'){
					await this.beforeChange(this.model)
				}
				const value = this.isChecked ? this.falseValue : this.trueValue;
				this.model = value;
			},
			handleDispatch(...args) {
				if (this.__parentComponent__) {
					this.__parentComponent__.$emit(...args);
				} else {
					this.__parentComponent__ = this.__parentComponent__ = this.dispatch("FormItem",...args);
				}
			}
		},
		watch: {
			value(val) {
				if (val === this.model) return;
				this.model = val;
			},
			model(val) {
				const bool = this.isChecked;
				this.$emit("input", val);
				this.$emit("on-change", val, bool);
				this.handleDispatch("on-change", val, bool);
			}
		}
	};
</script>


