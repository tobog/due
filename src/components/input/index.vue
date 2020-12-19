

<template>
	<section
		:class="wrapClasses"
		:data-vview-module="$options.name"
		v-click-outside="{ callback: close, reference: ($refs.drop || {}).$el }"
	>
		<aside v-if="prepend" :class="[_tobogPrefix_ + '-prepend']" :style="handlePendWidth('prepend')">
			<div ref="prepend" style="display:inline-block">
				<slot name="prepend"></slot>
			</div>
		</aside>
		<div :class="innerClasses" @mouseover="clearStatus=true" @mouseleave="clearStatus=false">
			<span v-if="showprefix" :class="iconWrapClass" data-type-icon="prefix" ref="prefix">
				<slot name="prefix">
					<Icons :type="prefix" :class="iconClass" center />
				</slot>
			</span>
			<span
				v-if="showsuffix"
				:class="iconWrapClass"
				@click.stop="handleIconClick"
				data-type-icon="suffix"
				ref="suffix"
			>
				<slot name="suffix">
					<Icons :type="suffix" center :class="iconClass" size="16" />
				</slot>
			</span>
			<Icons
				v-if="isClearable"
				:class="iconClasses"
				type="close"
				center
				@click.native.stop="handleClear"
			/>
			<div
				v-if="multiple"
				:style="handleInputStyle()"
				:class="inputClasses"
				ref="mulInputWrap"
				data-form="input"
				@click.stop="toggleOpen"
			>
				<div :class="[_tobogPrefix_ + '-tag']" v-for="(val,index) in model" :key="index">
					<span>{{handleValueText(val)}}</span>
					<Icons
						v-if="!disabled"
						:class="[_tobogPrefix_ + '-empty']"
						type="close"
						@click.native="clearTag(index)"
					></Icons>
				</div>
				<input :value="model" type="hidden" :name="name" />
				<input
					v-model="valueText"
					v-if="ready&&!isReadonly"
					type="text"
					ref="input"
					:autocomplete="autocomplete"
					:style="handleMultiInput"
					:class="[_tobogPrefix_ + '-taginput']"
					@focusin="handleFocus"
					@keydown.enter.stop="handleKeyEnter"
					@paste.stop.prevent="handleMultiPaste"
					@blur="handleBlur"
				/>
			</div>
			<template v-else-if="type==='file'">
				<input type="file" style="display:none" @change="handleChange" ref="file" :name="name" />
				<input
					v-show="ready"
					data-form="input"
					ref="input"
					:name="name"
					:value="getFilesName"
					type="text"
					:class="inputClasses"
					:style="handleInputStyle()"
					readonly
					@focusin="handleFocus"
					@blur="handleBlur"
					@click.stop="handleFileClick"
					v-bind="$attrs"
				/>
			</template>
			<input
				v-else
				v-show="ready"
				data-form="input"
				ref="input"
				:value="model"
				:name="name"
				:type="type"
				:class="inputClasses"
				:style="handleInputStyle()"
				:disabled="disabled"
				:readonly="readonly"
				:autocomplete="autocomplete"
				@input="handleInput"
				@focusin="handleFocus"
				@blur="handleBlur"
				@change="handleChange"
				@keydown.enter="handleKeyEnter"
				@keyup.stop="queryOption"
				@paste.stop="queryOption"
				@click.stop="toggleOpen"
				v-bind="$attrs"
			/>
		</div>
		<aside v-if="append" :class="[_tobogPrefix_ + '-append']" :style="handlePendWidth('append')">
			<div ref="append" style="display:inline-block">
				<slot name="append"></slot>
			</div>
		</aside>
		<template v-if="showDrop">
			<Drop
				ref="drop"
				v-show="visible&&!isReadonly"
				v-scroll-load="scrollLoad"
				:transfer="transfer"
				:updateDrop="updateDrop"
				:class="[_tobogPrefix_+'-drop']"
				:reference="$refs.input"
				:style="handleDropStyle()"
				@focusin.stop.native="dropFocus"
			>
				<slot></slot>
				<div v-if="hasValidOpts" style="padding:6px 15px;">
					<slot name="opttip">{{getOptTip}}</slot>
				</div>
			</Drop>
		</template>
	</section>
</template>

<script>
import Icons from '../icons/index'
import Drop from '../base/drop'
import ClickOutside from '../../directives/click-outside'
import ScrollLoad from '../../directives/scroll-load'
import Emitter from '../../utils/emitter'
import { debounce, throttle } from '../../utils/tool'
import { findComponentsDownward } from '../../utils/findComponent'
import mixin from './mixin'
export default {
	name: 'Input',
	inheritAttrs: false,
	mixins: [Emitter, mixin],
	directives: {
		ClickOutside,
		ScrollLoad
	},
	components: {
		Icons,
		Drop,
	},
	props: {
		multiple: Boolean,
		multipleKey: String,
		multiplSplit: {
			type: String,
			default: ','
		},
		transfer: Boolean,
		search: Boolean,
		filterable: Boolean,
		value: {
			default: '',
		},
		type: {
			type: String,
			default: 'text',
		},
		dropStyle: {
			type: [Object, String]
		},
		autoClose: {
			type: Boolean,
			default: true,
		},
		opttip: {
			type: String,
			default: undefined
		},
		beforeInput: Function
	},
	data() {
		return {
			visible: false,
			isFocus: false,
			valueText: "",
			optComponents: [],
			updateDrop: 0,
			filelist: []
		};
	},
	created() {
		this.__debounce = debounce(this.getAllOption);
		this.$on('on-select', this.select);
		this.$on('on-option-change', this.__debounce);
		this.searchMethod = throttle((val) => {
			this.$emit('on-search', val);
		}, 360);
		this.__isFocus = true;
	},
	computed: {
		getOptTip() {
			if (this.opttip === undefined) return this.langs('noDataText', '暂无数据');
			return this.opttip
		},
		inputClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-active`]: this.visible || this.isFocus,
					[`${_tobogPrefix_}-file`]: this.type === 'file',
				}
			];
		},
		getFilesName() {
			return [...this.model].map((file) => {
				return file.name
			}).join(',')
		},
		showDrop() {
			return this.ready && (this.search || this.filterable) && !this.multiple
		},
		handleMultiInput() {
			const style = {}, ready = this.ready, width = ((this.$refs.mulInputWrap || { clientWidth: 62 }).clientWidth - 62),
				_width = this.valueText.length * 12;
			style.width = (_width < 36 ? 36 : _width) + 'px';
			style.maxWidth = width > 0 ? `${width}px` : ''
			return style;
		},
		hasValidOpts() {
			return (this.$slots.opttip || this.getOptTip) && (!this.optComponents.some(function (item) {
				return !item.hidden
			}))
		},

	},
	methods: {
		langs(key, defaultVal, val = {}) {
			if (typeof this.$t !== 'function') return defaultVal;
			key = `${this.__$langPrefix__}.input.${key}`;
			key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
			const value = this.$t(key, val)
			return key === value ? defaultVal : value;
		},
		handleKeydown(e) {
			if (!this.visible || this.isReadonly || !this.optComponents.length) return;
			const keyCode = e.keyCode;
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
		toggleOpen() {
			if (this.isReadonly) return;
			if (this.search || this.filterable) {
				this.visible = !this.visible;
				this.__isFocus = true;
			}
			if (this.visible) this.isFocus = true;
			if (this.multiple) {
				this.visible = this.__isFocus = null;
				this.setInputFocus(null);
			}
		},
		handleFileClick() {
			this.$refs.file.click();
		},
		setInputFocus(isFocus) {
			this.__isFocus = isFocus;
			this.$refs.input.focus();
			this.isFocus = true;
			this.$nextTick(() => {
				this.handleClearTimeout();
			})
		},
		handleValueText(val) {
			if (val && typeof val === 'object' && this.multipleKey) return val[this.multipleKey];
			return val;
		},
		handleDropStyle() {
			const dropStyle = this.dropStyle || {}, width = (this.$refs.input || {}).offsetWidth;
			if (typeof dropStyle === 'string') {
				return `width:${width}px;${dropStyle}`
			} else {
				return { width: `${width}px`, ...dropStyle }
			}
		},
		scrollLoad(event) {
			this.$emit('on-scroll-loading', this.model, event);
		},
		getAllOption() {
			const model = this.model;
			this.optComponents = findComponentsDownward(this, 'Option');
			this.optComponents.forEach(component => {
				component.$emit('on-selected', model);
			});
		},
		select(val, text, attach) {
			this.updateModel(text);
			this.__attach = attach;
			this.__hiddenId = val;
			this.setInputFocus(false);
		},
		selectedOpt(val) {
			this.optComponents.forEach(component => {
				component.$emit('on-selected', val);
			});
		},
		handleClear() {
			this.__attach = '';
			this.updateModel(this.multiple ? [] : '')
			this.$emit('on-clear');
		},
		async queryOption(event) {
			if (!this.visible) return;
			const keyCode = event.keyCode;
			if (keyCode == 13 || keyCode == 40 || keyCode == 37 || keyCode == 38 || keyCode == 39) {
				this.handleKeydown(event);
				return;
			}
			const val = await this.handleBeforeInput(event.target.value || this.model, event);
			this.__attach = '';
			if (this.search) {
				this.searchMethod(val);
			} else if (this.filterable) {
				this.optComponents.forEach(component => {
					component.$emit('on-query-option', val);
				});
			}
			setTimeout(() => {
				this.updateDrop += 1;
			}, 60)
		},
		async handleBeforeInput(val, event) {
			return typeof this.beforeInput === 'function' ? await this.beforeInput(val, event) : val;
		},
		async handleMultiPaste(event) {
			const data = await this.handleBeforeInput(event.clipboardData.getData('Text') || window.clipboardData.getData('Text'), event);
			this.updateModel([...this.model, ...(this.multiplSplit ? data.split(new RegExp('\\' + this.multiplSplit, 'g')) : [data])]);
		},
		handleChange(event) {
			if (this.type === 'file') {
				this.updateModel(files)
			}
			this.$nextTick(() => {
				this.$emit('on-change', this.model, this.__attach);
			});
		},
		handleFocus(event) {
			this.isFocus = true;
			if (this.__isFocus) {
				this.$emit('on-focus', this.model, event);
			} else if (this.__isFocus !== null) {
				this.handleChange(event);
				this.$emit('on-select-option', this.model, this.__hiddenId, event);
			}
			this.selectedOpt(this.model);
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.__isFocus = true;
				})
			})
		},
		handleKeyEnter(event) {
			if (this.multiple) {
				if (this.valueText) {
					this.updateModel([...this.model, this.valueText])
				}
				this.$emit('on-enter', this.model, this.valueText, event);
				this.valueText = "";
				return;
			}
			this.handleKeydown(event);
			this.$nextTick(() => {
				this.close(true, event);
				this.$emit('on-enter', this.model, event);
			})
		},
		dropFocus(event) {
			this.$nextTick(() => {
				this.visible = true;
				this.handleClearTimeout();
			})
		},
		handleBlur(event) {
			let value;
			if (this.type === 'number') {
				value = this.handleRange(this.model);
			}
			if (this.multiple) {
				if (value !== undefined) this.valueText = value;
				if (!this.valueText) return;
				this.updateModel(this.model instanceof Array ? [...this.model, this.valueText] : [this.valueText]);
				this.valueText = '';
			} else {
				this.updateModel(value !== undefined ? value : this.model);
			}
			this.close(true, event);
		},

		handleRange(val) {
			if (this.type !== 'number' || val === "" || val === undefined) return;
			const { max, min } = this.$attrs;
			if ((min !== "" && min !== undefined) && val < min) {
				return min
			}
			if ((max !== "" && max !== undefined) && val > max) {
				return max
			}
		},
		close(status, event) {
			if (!this.isFocus) return;
			clearTimeout(this.__timeout);
			if (status || this.autoClose) {
				console.log(status, event, event && event.type)
				this.__timeout = setTimeout(() => {
					this.forceClose(event);
				}, 130);
			}
		},
		forceClose(event) {
			clearTimeout(this.__clearTimeout);
			clearTimeout(this.__timeout);
			this.visible = this.isFocus = this.__timeout = null;
			this.handleDispatch('on-validate', this.model);

		},
		clearTag(index) {
			const data = [...this.model]
			const item = data.splice(index, 1);
			this.updateModel(data);
			this.$emit('on-remove-item', item, index);
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
			this.selectedOpt(val);
			this.$emit('input', val);
			this.handleDispatch('on-change', val);
		},
		handleInput(event) {
			this.updateModel(event.target.value)
		}
	},
	watch: {
		value: {
			immediate: true,
			deep: true,
			handler(val, old) {
				if (this.multiple && !(val instanceof Array)) val = (val || val === 0) ? [val] : [];
				this.updateModel(val)
			},
		},
		isFocus(val, old) {
			if (!val) {
				this.$nextTick(() => {
					this.$emit('on-change', this.model, this.__attach);
					this.$emit('on-blur', this.model);
				});
			}
		},
		// model(val) {
		// 	this.selectedOpt(val);
		// 	this.handleRange(val);
		// 	this.$emit('input', val);
		// 	this.handleDispatch('on-change', val);
		// },
		visible(val, old) {
			if (val) {
				this.optComponents.forEach(component => {
					component.hidden = false;
				});
			}
			this.$emit('on-visible-change', val);
		},
	},
	beforeDestroy() {
		clearTimeout(this.__timeout);
		clearTimeout(this.__clearTimeout);
		this.__timeout = null;
		this.$off('on-select', this.select);
		this.$off('on-option-change', this.__debounce);
	},
};
</script>
