
<template>
	<section
		:class="wrapClasses"
		:data-vview-module="$options.name"
		v-click-outside="{ callback: close, reference: ($refs.drop || {}).$el }"
	>
		<div
			ref="selectwrap"
			data-form="select"
			:class="innerClasses"
			@click.stop="toggleOpen"
			@mouseover="clearStatus=true"
			@mouseleave="clearStatus=false"
		>
			<template v-if="multiple">
				<div :class="[_tobogPrefix_ + '-tag']" v-for="(val,index) in model" :key="index">
					<span>{{getOptionData(val,1)||val}}</span>
					<Icons
						v-if="!disabled"
						:class="[_tobogPrefix_ + '-empty']"
						type="close"
						data-type-icon
						@click.native.stop="clearTag(index)"
					></Icons>
				</div>
			</template>
			<Icons
				v-if="isClearable&&!isReadonly"
				:class="[_tobogPrefix_ + '-icon']"
				type="close"
				center
				@click.native.stop="handleClear"
			/>
			<Icons
				v-else
				:class="arrowClasses"
				type="arrow-dropdown"
				center
				@click.native.stop="toggleOpen"
			/>
			<input
				ref="select"
				type="text"
				v-model="valueText"
				:class="[_tobogPrefix_]"
				:disabled="disabled"
				:autocomplete="autocomplete"
				:readonly="readonly||!filterable"
				:style="handleInputStyle"
				@blur="handleBlur"
				@keydown.enter="handleKeyEnter"
				@keyup.stop="queryOption"
				@paste.stop="queryOption"
				v-bind="$attrs"
			/>
			<input :name="name" :value="value" type="hidden" />
		</div>
		<template v-if="ready">
			<Drop
				ref="drop"
				v-show="visible&&!isReadonly"
				v-scroll-load="scrollLoad"
				:transfer="transfer"
				:updateDrop="updateDrop"
				:class="[_tobogPrefix_+'-drop']"
				:reference="$refs.selectwrap"
				:style="handleDropStyle()"
				@focusin.stop.native="dropFocus"
				@click.stop
			>
				<slot></slot>
				<template v-if="hasValidOpts">
					<slot name="opttip">
						<div :class="_tobogPrefix_+'-opttip'" v-html="getOptTip"></div>
					</slot>
				</template>
			</Drop>
		</template>
	</section>
</template>

<script>
import Icons from '../icons/index';
import Drop from '../base/drop';
import ClickOutside from '../../directives/click-outside';
import ScrollLoad from '../../directives/scroll-load';
import Emitter from '../../utils/emitter';
import { debounce, throttle } from '../../utils/tool';
import { findComponentsDownward } from '../../utils/findComponent';

export default {
	name: 'Select',
	inheritAttrs: false,
	mixins: [Emitter],
	directives: {
		ClickOutside,
		ScrollLoad
	},
	components: {
		Icons,
		Drop,
	},
	props: {
		name: String,
		disabled: {
			default: false,
			type: Boolean,
		},
		readonly: {
			default: false,
			type: Boolean,
		},
		multiple: {
			default: false,
			type: Boolean,
		},
		clearable: {
			default: false,
			type: Boolean,
		},
		filterable: {
			default: false,
			type: Boolean,
		},
		transfer: {
			default: false,
			type: Boolean,
		},
		value: {
			type: [String, Array, Number],
			default: '',
		},
		strict: {
			default: true,
			type: Boolean,
		},
		search: {
			default: false,
			type: Boolean,
		},
		dropStyle: [Object, String],
		// inputStyle:[Object, String],
		autoClose: {
			type: Boolean,
			default: true,
		},
		theme: String,
		opttip: {
			type: String,
			// default: "暂无数据"
			default: undefined
		},
		autocomplete: {
			type: String,
			default: 'off',
		},
		beforeInput: Function
	},
	data() {
		return {
			visible: false,
			clearStatus: false,
			valueText: '',
			options: {},
			optComponents: [],
			model: this.value,
			updateDrop: 0,
			ready: false,
			isFocus: false,
		};
	},
	created() {
		this.__debounce = debounce(this.getAllOption);
		this.__updatedDrop = debounce(this.updatedDrop, 60);
		this.$on('on-select', this.select);
		this.$on('on-option-change', this.__debounce);
		this.$on('on-updated', this.__updatedDrop);
		this.searchMethod = throttle((a, b, c, d, e) => {
			this.$emit('on-search', a, b, c, d, e);
		}, 360);
		this.handleDispatch('on-change', this.model);
	},
	mounted() {
		this.ready = true
	},
	computed: {
		isReadonly() {
			return this.disabled || this.readonly
		},
		handleInputStyle() {
			if (!this.multiple) return;
			if (this.isReadonly) return { width: 0 }
			const ready = this.ready, style = {}, width = ((this.$refs.selectwrap || { clientWidth: 36 }).clientWidth - 36);
			style.width = this.valueText.length * 12 + 6 + 'px';
			style.maxWidth = width > 0 ? `${width}px` : ''
			return style;
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-multiple`]: this.multiple,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
				},
			];
		},
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-readonly`]: this.readonly && !this.disabled,
					[`${_tobogPrefix_}-active`]: this.visible || this.isFocus,
				},

			];
		},
		isClearable() {
			return !this.disabled && this.clearable && this.value !== '' && this.clearStatus;
		},
		arrowClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-icon`,
				{
					[`${_tobogPrefix_}-arrow-active`]: this.visible,
				},
			];
		},
		hasValidOpts() {
			const visible = this.visible;
			return (this.$slots.opttip || this.getOptTip) && (!this.optComponents.some(function (item) {
				return !item.hidden
			}))
		},
		getOptTip() {
			if (this.opttip === undefined) return this.langs('noDataText', '暂无数据');
			return this.opttip
		},
	},
	methods: {
		langs(key, defaultVal, val = {}) {
			if (typeof this.$t !== 'function') return defaultVal;
			key = `${this.__$langPrefix__}.select.${key}`;
			key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
			const value = this.$t(key, val)
			return key === value ? defaultVal : value;
		},

		handleKeydown(event) {
			const keyCode = event.keyCode;
			// console.log(keyCode, 'keyCode')
			if (!this.visible || this.isReadonly || keyCode == 32) return;
			// Esc slide-up
			if (keyCode == 27) this.close(true, 'select');
			// next
			if (keyCode == 38) this.navigateOptions(-1);
			if (keyCode == 40) this.navigateOptions(1);
			if (keyCode == 13) {
				const component = this.optComponents.find(component => component.hover);
				if (component) component.select();
			}
		},
		navigateOptions(val) {
			let index,
				optComponents = this.optComponents.filter(component => !component.hidden),
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
			// console.log(index)
			if (index < 0) index = 0;
			if (index > lastIndex) index = lastIndex;
			const component = optComponents[index];
			component.hover = true;
			this.focusIndex(component, index)
		},
		focusIndex(component, index) {
			if (index < 0) return;
			// update scroll
			const element = component.$el, parentNode = element.parentNode,
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
		handleDropStyle() {
			const dropStyle = this.dropStyle || {}, width = (this.$refs.selectwrap || {}).offsetWidth || "";
			if (typeof dropStyle === 'string') {
				return `width:${width}px;${dropStyle}`
			} else {
				return { width: `${width}px`, ...dropStyle }
			}
		},
		toggleOpen() {
			// console.log('toggleOpen')
			this.handleClearTimeout();
			if (this.isReadonly) return;
			this.visible = !this.visible;
			if (this.visible) this.handleFocus();
		},
		scrollLoad(event) {
			this.$emit('on-scroll-loading', this.valueText, this.model, this.__attach, event);
		},
		getOptionData(val, index = 0) {
			return (this.options[val] || [])[index] || '';
		},
		getAllOption() {
			const options = {}, model = this.model;
			this.optComponents = findComponentsDownward(this, 'Option');
			this.optComponents.forEach(component => {
				const { value, text, attach } = component;
				options[value] = [value, text(), attach];
				component.$emit('on-selected', model);
			});
			this.options = options;
			if (!this.__writable) {
				this.valueText = this.multiple ? '' : this.getOptionData(model, 1);
			}
		},
		select(val, valueText, attach) {
			if (this.multiple) {
				let model = (this.model instanceof Array) ? [...this.model] : [];
				if (this.strict) {
					val = model.some(item => item === val) ? model.filter(item => item !== val) : [...model, val];
				} else {
					val = model.some(item => item == val) ? model.filter(item => item != val) : [...model, val];
				}
				this.handleClearTimeout();
			} else {
				this.close(true, 'select');
				this.visible = false;
			}
			this.updateModel(val);
			this.__attach = attach;
			this.valueText = this.multiple ? "" : this.getOptionData(val, 1);
			this.handleFocus();
			this.handleChange();
		},
		selectedOpt(val) {
			this.optComponents.forEach(component => {
				component.$emit('on-selected', val);
			});
		},
		async handleBeforeInput(val) {
			return typeof this.beforeInput === 'function' ? await this.beforeInput(val) : val;
		},
		async queryOption(event) {
			if (!this.visible) return;
			const keyCode = event.keyCode;
			if (keyCode == 13 || keyCode == 40 || keyCode == 37 || keyCode == 38 || keyCode == 39) {
				this.handleKeydown(event);
				return;
			}
			this.__attach = '';
			this.__writable = true;
			const val = this.valueText = await this.handleBeforeInput(this.valueText || event.target.value);
			console.log('queryOption', val)
			if (this.filterable) {
				if (this.search) {
					this.searchMethod(val, this.model, event);
				} else {
					this.optComponents.forEach(component => {
						component.$emit('on-query-option', val);
					});
					this.$nextTick(() => {
						const bool = this.optComponents.some(component => {
							return !component.hidden
						});
						this.$emit('on-match', bool);
					})
				}
				setTimeout(() => {
					this.updateDrop += 1;
				}, 60)
			}
		},
		updatedDrop() {
			this.$nextTick(() => {
				this.updateDrop += 1;
			})
		},
		afterLeave() {
			const valueText = this.valueText, multiple = this.multiple;
			if (valueText) {
				for (const option of Object.values(this.options)) {
					const text = option[1], value = option[0];
					if (text === valueText) {
						this.__attach = option[2];
						this.updateModel(multiple ? [...this.model, value] : value);
						return;
					}
				}
				this.valueText = this.__attach = '';
			}
			if (!multiple) {
				this.__attach = '';
				this.updateModel('');
			}
		},
		close(status, type) {
			// console.log(status, type, this.isFocus)
			if (!this.isFocus || (type === 'clickout' && !this.visible)) return;//为了v-click-out
			clearTimeout(this.__timeout);
			if (status || (this.autoClose && !this.multiple)) {
				this.__timeout = setTimeout(() => {
					this.forceClose(type, event)
				}, 160);
			}
		},
		forceClose(type, event) {
			this.isFocus = (type === 'select' && this.filterable) ? true : null;
			this.visible = this.__timeout = this.__writable = null;
			this.afterLeave();
			this.handleDispatch('on-validate', this.model);
			if (type === 'blur' || type === 'clickout') this.handleChange();
			this.$emit('on-blur', this.model, this.valueText, this.__attach, event);
			clearTimeout(this.__clearTimeout);
		},
		clearTag(index) {
			const data = [...this.model];
			const item = data.splice(index, 1);
			this.__attach = '';
			this.updateModel(data);
			this.$emit('on-remove-item', item, index);
		},
		handleClear() {
			this.__attach = ''
			this.updateModel(this.multiple ? [] : '');
		},
		handleFocus() {
			this.$refs.select.focus();
			this.isFocus = true;
			this.$emit('on-focus', this.model, this.valueText, this.__attach);
			this.__writable = false;
			this.selectedOpt(this.model);
		},
		dropFocus() {
			this.$nextTick(() => {
				this.visible = this.isFocus = true;
				this.handleClearTimeout();
			})
		},
		handleBlur() {
			this.$nextTick(() => {
				this.close(true, 'blur');
			})
		},
		handleChange(event) {
			const modelText = this.valueText + JSON.stringify(this.model);
			if (!event && this.__preModelText === modelText) return;//防止多次触发on-change
			this.$emit('on-change', this.model, this.valueText, this.__attach);
			this.__preModelText = modelText;
		},
		handleKeyEnter() {
			if (!this.visible) return this.toggleOpen();
			this.close(true);
			this.$emit('on-enter', this.model, this.valueText);
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},
		handleClearTimeout() {
			clearTimeout(this.__timeout);
			clearTimeout(this.__clearTimeout);
			this.__clearTimeout = setTimeout(() => {
				clearTimeout(this.__timeout);
			}, 50)
		},
		updateModel(val) {
			if (val === this.model) return;
			this.model = val;
			this.valueText = this.multiple ? '' : this.getOptionData(val, 1);
			this.selectedOpt(val);
			this.$emit('input', val, this.valueText);
			this.handleDispatch('on-change', val, this.valueText);
		}
	},
	watch: {
		visible(val, old) {
			if (val) {
				this.optComponents.forEach(component => {
					component.hidden = component.hover = false;
				});
				this.updateDrop += 1;
			}
			this.$emit('on-visible-change', val);
		},
		value: {
			immediate: true,
			deep: true,
			handler(val, old) {
				if (this.multiple && !(val instanceof Array)) val = (val || val === 0) ? [val] : [];
				this.updateModel(val)
			},
		},
	},
	beforeDestroy() {
		clearTimeout(this.__timeout);
		clearTimeout(this.__clearTimeout);
		this.__timeout = null;
	},
};
</script>
