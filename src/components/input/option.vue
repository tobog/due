
<template>
	<div
		v-show="!hidden"
		:class="wrapClasses"
		@click="select"
		@mousedown.prevent
		:data-vue-module="$options.name"
	>
		<span ref="text">
			<slot>{{getText}}</slot>
		</span>
		<slot name="selected" :selected="selected">
			<Icons v-if="multiple && selected" type="ios-checkmark" :class="iconClass"></Icons>
		</slot>
	</div>
</template>
<script>
import Icons from '../icons/index';
import Emitter from '../../utils/emitter';
import { debounce } from '../../utils/tool';
export default {
	inheritAttrs: false,
	name: 'Option',
	mixins: [Emitter],
	components: {
		Icons,
	},
	props: {
		value: {
			type: [String, Number],
			required: true,
		},
		label: {
			type: [String, Number],
			default: undefined
		},
		disabled: Boolean,
		strict: {
			type: Boolean,
			default: undefined
		},
		theme: String,
		attach: {}
	},
	data() {
		return {
			selected: false,
			hidden: false, // for search
			formItemComponent: null,
			hover: false,
		};
	},
	created() {
		this.__debounce = debounce(this.queryChange);
		this.$on('on-selected', this.handleHighlight);
		this.$on('on-query-option', this.__debounce);
		this.handleDispatch('on-option-change', "created", this);
	},
	computed: {
		getTheme(){
			return this.theme || (this.__parentComponent__ || {}).theme;
		},
		getText() {
			return this.label !== undefined ? this.label : this.value;
		},
		multiple() {
			return this.formItemComponent && this.formItemComponent.multiple;
		},
		stricts() {
			if (this.strict !== undefined) return this.strict;
			return this.formItemComponent && this.formItemComponent.strict === false ? false : true;
		},
		iconClass() {
			return `${this._tobogPrefix_}-icon-selected`
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-selected`]: this.selected,
					[`${_tobogPrefix_}-hover`]: this.hover,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
					[`${_tobogPrefix_}-multiple-selected`]: this.multiple && this.selected,
					[`${_tobogPrefix_}-${this.getTheme}`]: !!this.getTheme,
				},
			];
		},
	},
	methods: {
		text() {
			const text = this.label !== undefined ? this.label : (this.$refs.text || {}).textContent || this.value;
			return `${text}`.trim();
		},
		select() {
			this.hover = false;
			if (this.disabled) return;
			const text = this.text(), attach = this.attach === undefined ? { label: this.label, text } : this.attach;
			this.handleDispatch('on-select', this.value, text, attach);
			this.handleDispatch('on-attach', attach, this.value, text);
		},
		queryChange(val = '') {
			if (val === '' || this.selected) return this.hidden = false;
			this.hover = false;
			const parsedQuery = `${val}`.replace(/(\^|\(|\)|\[|\]|\$|\*|\\+|\.|\?|\\|\{|\}|\|)/g, function (match, reg, offset, str) {
				if (reg === '\\') return '\\\\'
				return reg;
			}).trim();
			try {
				const text = this.text(),
					match = text.indexOf(val) > -1;
				this.hover = text === val;
				this.hidden = match ? false : !(new RegExp(parsedQuery, 'ig').test(text));
			} catch (error) {
				console.error(error)
			}
			this.$nextTick(()=>{
				this.handleDispatch('on-updated', true);
			})
		},
		handleHighlight(value = '') {
			const isArray = Array.isArray(value) && this.multiple;
			if (isArray) {
				this.selected = this.stricts ? value.indexOf(this.value) > -1 : value.some((val) => {
					return this.value == val;
				});
			} else {
				this.selected = this.stricts ? this.value === value : this.value == value;
			}
		},
		handleDispatch(...args) {
			if (this.__parentComponent__) {
				this.__parentComponent__.$emit(...args)
			} else {
				this.formItemComponent = this.__parentComponent__ = this.dispatch(['Input', 'Select'], ...args);
			}
		},
	},
	watch: {
		value: {
			handler(val) {
				this.handleDispatch('on-option-change', "change", this)
			},
			deep: true,
		},
	},
	beforeDestroy() {
		this.handleDispatch('on-option-change', 'destroy', this)
	},
};
</script>
