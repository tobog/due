

<template>
	<InputDrop
		ref="dropbase"
		:class="wrapClasses"
		:data-vue-module="$options.name"
		:transfer="transfer"
		:dropStyle="dropStyle"
		:reference="$refs.inputInner"
		:visible="visible&&showDrop"
		@on-close="handleBlur"
	>
		<aside v-if="prepend" ref="prepend" :class="[_tobogPrefix_ + '-prepend']">
			<slot name="prepend"></slot>
		</aside>
		<div
			:class="innerClasses"
			ref="inputInner"
			data-form="input"
			tabindex="1"
			@focusin="handleFocus"
			@click="toggleOpen"
		>
			<span v-if="showPrefix" :class="[_tobogPrefix_ + '-prefix']">
				<slot name="prefix">
					<Icons :type="prefix" center />
				</slot>
			</span>
			<div v-if="multiple" :class="[_tobogPrefix_ + '-tags']" @click.self="handleFileClick">
				<span :class="[_tobogPrefix_ + '-tag']" v-for="(val, index) in model" :key="index">
					{{ handleMultiText(val) }}
					<Icons
						v-if="!isReadonly"
						:class="[_tobogPrefix_ + '-tag-clear']"
						type="close"
						@click.native.stop="clearTag(index)"
					></Icons>
				</span>
				<input
					ref="input"
					:value="valueText"
					:type="getType"
					:name="isFile ? name : ''"
					:class="inputClasses"
					:disabled="disabled"
					:multiple="multiple"
					:readonly="isInputReadonly"
					@input="handleInput"
					@keydown="handleKeydown"
					@change="handleOtherChange"
					@paste.stop.prevent="handleMultiPaste"
					v-bind="$attrs"
				/>
			</div>
			<input
				v-else
				ref="input"
				:value="valueText"
				:type="getType"
				:name="isFile ? name : ''"
				:class="inputClasses"
				:disabled="disabled"
				:multiple="multiple"
				:readonly="isInputReadonly"
				@input="handleInput"
				@keydown="handleKeydown"
				@change="handleOtherChange"
				@paste.stop.prevent="handleMultiPaste"
				v-bind="$attrs"
			/>
			<div
				v-if="isFile && !multiple"
				:class="[_tobogPrefix_ + '-tags']"
				@click.stop="handleFileClick"
			>{{ handleMultiText(model) }}</div>
			<input v-if="name||name=='0'" :name="name" :value="model" type="hidden" />
			<Icons
				v-if="isClearable"
				:class="clearClass"
				type="close"
				center
				@click.native.stop="handleClear"
			/>
			<Icons v-if="isSelect" :class="[_tobogPrefix_ + '-arrow']" type="arrow-dropdown" center />
			<span
				v-if="!isSelect && showSuffix"
				:class="[_tobogPrefix_ + '-suffix']"
				@click.stop="handleIconClick"
			>
				<slot name="suffix">
					<Icons :type="suffix" center />
				</slot>
			</span>
		</div>
		<aside v-if="append" :class="[_tobogPrefix_ + '-append']">
			<slot name="append"></slot>
		</aside>
		<template slot="drop">
			<slot></slot>
			<div v-if="hasValidOpts" :class="[_tobogPrefix_ + '-tip']">
				<slot name="tip">{{ tip }}</slot>
			</div>
		</template>
	</InputDrop>
</template>

<script>
import Icons from "../icons/index";
import InputDrop from "./inputdrop";
import { throttle, validVal, debounce } from "../../utils/tool";
import mixin from "./mixin";
export default {
	name: "Input",
	inheritAttrs: false,
	mixins: [mixin],
	components: {
		Icons,
		InputDrop
	},
	props: {
		multipleKey: String,
		transfer: Boolean,
		search: Boolean,
		filterable: {
			type: Boolean,
			default: true
		},
		value: {
			default: ""
		},
		type: {
			type: String,
			default: "text"
		},
		dropStyle: {
			type: [Object, String]
		},
		autoClose: {
			type: Boolean,
			default: true
		},
		tip: {
			type: String,
			default: "暂无数据"
		},
		keyModal: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			visible: false,
			isActive: false,
			optComponents: [],
			valueText: "",
		};
	},
	created() {
		this._updatedDrop = debounce(this.updatedDrop, 60);
		this.$on("on-select", this.select);
		this.$on("on-updated", this._updatedDrop);
		this.$on("on-option-change", this.getAllOption);
		this.searchMethod = throttle(val => {
			this.$emit("on-search", val);
		}, 360);
	},
	computed: {
		getMultipleKey() {
			if (this.isFile) return this.multipleKey || "name";
			return this.multipleKey;
		},
		getType() {
			const type = this.type;
			if (!type || type === "select" || this.isSelect) return "text";
			return type;
		},
		isFile() {
			return this.getType === "file";
		},
		isSelect() {
			return this.type === "select";
		},
		isInputText() {
			return this.filterable || this.search;
		},
		isInputReadonly() {
			return (
				this.isReadonly ||
				(this.isSelect && !this.isInputText) ||
				this.isFile
			);
		},
		inputClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-file`]: this.isFile
				}
			];
		},
		getFilesName() {
			return this.multiple
				? this.model.map(file => {
					return file.name;
				})
				: this.model && this.model.name;
		},
		hasValidOpts() {
			const hasTip = this.$slots.tip || this.tip;
			return hasTip && this.hasDrop && !this.optComponents.some(item => !item.hidden);
		},
		hasDrop() {
			return !!(this.isSelect || this.optComponents.length > 0);
		},
		showDrop() {
			return !!(this.isSelect || this.optComponents.length > 0 || this.$slots.default);
		},
	},
	methods: {
		getAllOption(type, component) {
			const model = this.model;
			if (type === "destroy") {
				const index = this.optComponents.indexOf(component);
				index > -1 && this.optComponents.splice(index, 1);
				return;
			}
			if (type === "change") {
				component.$emit("on-selected", model);
			}
			if (type === "created") {
				component.$emit("on-selected", model);
				this.optComponents.push(component);
			}
		},
		select(val, text, attach) {
			if (this.multiple) {
				const model = Array.isArray(this.model)
					? this.model
					: [this.model];
				if (this.strict) {
					val = model.some(item => item === val)
						? model.filter(item => item !== val)
						: [...model, val];
				} else {
					val = model.some(item => item == val)
						? model.filter(item => item != val)
						: [...model, val];
				}
			} else if (this.autoClose) {
				this.visible = false;
			}
			this.__attachData = attach;
			this.updateModel(val);
			this.setInputFocus(); //有问题无法失去焦点
			this.$emit("on-change", this.model, this.__attachData);
		},
		selectedOpt(val) {
			this.optComponents.forEach(component => {
				component.$emit("on-selected", val);
			});
		},
		getInputDomValue() {
			return this.$refs.input.value;
		},
		handleKeydown(event) {
			if (this.isReadonly || !this.isActive) return;
			const keyCode = event.keyCode,
				visible = this.visible;
			if (!visible && keyCode == 13 && this.hasDrop) {
				return (this.visible = true);
			}
			if (!this.keyModal) return;
			// Esc slide-up
			// next
			if (keyCode == 38 && visible) {
				event.preventDefault();
				this.navigateOptions(-1);
			}
			if (keyCode == 40 && visible) {
				event.preventDefault();
				this.navigateOptions(1);
			}
			if (keyCode == 13) {
				const component = this.getMatchedOpt();
				if (!component) this.handleModel(event.target.value);
				this.$nextTick(() => {
					this.$emit("on-enter", this.model, event);
					this.visible = false;
				});
			}
			if (keyCode == 27) {
				// this.__attachData = "";
				this.visible = false;
			}
		},
		navigateOptions(val) {
			let index,
				optComponents = this.optComponents.filter(
					component => !component.hidden
				),
				lastIndex = optComponents.length - 1;
			optComponents.forEach((component, i) => {
				if (component.hover) index = i;
				component.hover = false;
			});
			if (index === undefined) {
				optComponents.forEach((component, i) => {
					if (component.selected) index = i;
				});
			}
			index = (index || 0) + val;
			console.log(index);
			if (index < 0) index = 0;
			if (index > lastIndex) index = lastIndex;
			const component = optComponents[index];
			component.hover = true;
			this.focusIndex(component, index);
		},
		focusIndex(component, index) {
			if (index < 0) return;
			// update scroll
			const element = component.$el,
				parentNode = element.parentNode,
				elementRect = element.getBoundingClientRect(),
				parentRect = parentNode.getBoundingClientRect(),
				bottomOverflowDistance = elementRect.bottom - parentRect.bottom,
				topOverflowDistance = elementRect.top - parentRect.top;
			if (bottomOverflowDistance > 0) {
				parentNode.scrollTop += bottomOverflowDistance;
			}
			if (topOverflowDistance < 0) {
				parentNode.scrollTop += topOverflowDistance;
			}
		},
		handleMultiText(val) {
			const key = this.getMultipleKey;
			if (val && key) return val[key];
			return val;
		},
		handleMultiPaste(event) {
			const data =
				event.clipboardData.getData("Text") ||
				window.clipboardData.getData("Text");
			event.target.value = data;
			this.handleInput(event);
		},
		handleInput(event) {
			if (
				this.isInputReadonly ||
				(this.isSelect && !this.visible) ||
				[13, 40, 27, 38].indexOf(event.keyCode) > -1
			)
				return;
			const value = (this.valueText = event.target.value);
			this.__attachData = "";
			if (this.search) {
				this.searchMethod(value, this.model, event);
				return;
			}
			if (this.filterable || !this.isSelect) {
				this.optComponents.forEach(component => {
					component.$emit("on-query-option", value);
				});
			}
			this._updatedDrop();
			if (!this.multiple && !this.isSelect) {
				this.updateModel(value);
			}
		},
		toggleOpen() {
			if (this.isReadonly) return;
			this.visible = !this.visible;
			if (this.multiple) this.setInputFocus();
			this.isActive = true;
		},
		getSelectedOpts() {
			return this.optComponents.filter(component => component.selected);
		},
		getMatchedOpt(value, isUpdate) {
			if (isUpdate) {
				this.optComponents.forEach(component => {
					component.$emit("on-query-option", value);
				});
			}
			const component = this.optComponents.find(
				component => component.hover
			);
			if (component) component.select();
			return component;
		},

		handleFileClick(event) {
			// if (this.isReadonly) return;
			if (this.isFile) {
				this.$refs.input.click();
			}
		},
		handleOtherChange() {
			if (this.getType === "text" || this.isSelect) return;
			let value;
			if (this.isFile) {
				const files = this.$refs.input.files;
				value = this.multiple ? [...files] : files[0];
			} else {
				value = this.getInputDomValue();
			}
			this.updateModel(value);
			this.$emit("on-change", this.model, this.__attachData);
		},
		setInputFocus() {
			if (!this._isFocused) return;
			this.$refs.input.focus();
		},
		handleFocus(event) {
			this.isActive = true;
			if (this._isFocused) return;
			this._isFocused = true;
			this.selectedOpt(this.model);
			this.$nextTick(() => {
				this.$emit("on-focus", this.model, event);
			});
		},
		handleModel(value) {
			const isValid = validVal(value);
			const component = isValid && this.getMatchedOpt(value, true);
			if (component) return;
			if (isValid && this.multiple) {
				console.log(value, isValid, this.multiple, 'this.multiple')
				if (this.isSelect) {
					this.valueText = this.__attachData = "";
				} else {
					this.updateModel(
						Array.isArray(this.model)
							? [...this.model, value]
							: [value]
					);
				}
				return;
			}
			if (!this.multiple) {
				if (this.isSelect) {
					if (isValid) {
						this.valueText = this.getValueText();
					} else {
						this.updateModel("");
					}
				} else {
					this.updateModel(value);
				}
				return;
			}
		},
		handleBlur() {
			if (!this.isActive) return;
			this._isFocused = false;
			console.log(this.isInputReadonly, 'this.isInputReadonly')
			if (!this.isInputReadonly)
				this.handleModel(this.getInputDomValue());
			if (this.getType === "number") {
				const value = this.handleRange(this.model);
				value !== undefined && this.updateModel(value);
			}
			this.$nextTick(() => {
				!this.isFile &&
					this.$emit("on-change", this.model, this.__attachData);
				this.$emit("on-blur", this.model, this.__attachData);
				this.close(true);
			});
		},
		close(status) {
			this.__attachData = "";
			this.visible = this._isFocused = this.isActive = false;
			this.handleDispatch("on-validate", this.model);
		},
		handleRange(val) {
			if (!validVal(val)) return;
			const { max, min } = this.$attrs;
			if ((min || min == "0") && val < min) return parseFloat(min);
			if ((max || max == "0") && val > max) return parseFloat(max);
		},
		getValueText() {
			if (this.multiple) return "";
			const data = this.optComponents.find(item => {
				if (this.strict) return item.value === this.model;
				return item.value == this.model;
			});
			const text = data && data.text();
			if (this.isSelect) {
				return text === undefined ? "" : text;
			}
			return text === undefined ? this.model : text;
		},
		updateModel(val) {
			if (val === this.model) return;
			this.model = val;
			this.selectedOpt(val);
			this.valueText = this.getValueText();
			this.$emit("input", val);
			this.handleDispatch("on-change", val);
			this.__attachData = "";
		},
		handleClear() {
			this.__attachData = "";
			this.updateModel(this.multiple ? [] : "");
			this.setInputFocus();
			this.$emit("on-clear");
		},
		clearTag(index) {
			const data = [...this.model];
			const item = data.splice(index, 1);
			this.updateModel(data);
			this.$emit("on-remove-item", item, index);
		},
		updatedDrop() {
			this.$nextTick(() => {
				this.$refs.dropbase.updatedDrop();
			});
		}
	},
	watch: {
		value: {
			immediate: true,
			deep: true,
			handler(val, old) {
				this.$nextTick(() => {
					if (this.multiple && !Array.isArray(val))
						val = validVal(val) ? [val] : [];
					this.updateModel(val);
				});
			}
		},
		visible(val, old) {
			if (val) {
				this.optComponents.forEach(component => {
					component.hidden = component.hover = false;
				});
			}
			this.$emit("on-visible-change", val);
		}
	},
	beforeDestroy() {
		// this.$off("on-select", this.select);
		// this.$off("on-option-change", this.getAllOption);
	}
};
</script>
