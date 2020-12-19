

export default {
	props: {
		name: String,
		suffix: String,
		prefix: String,
		clearable: Boolean,
		readonly: Boolean,
		disabled: Boolean,
		inputStyle: [String, Object],
		theme: String,
		autocomplete: {
			type: String,
			default: 'off',
		}
	},
	data() {
		return {
			clearStatus: false,
			model: this.value,
			ready: false,
		}
	},
	created() {
		this.handleDispatch('on-change', this.model);
	},
	mounted() {
		this.ready = true;
	},

	computed: {
		isReadonly() {
			return this.disabled || this.readonly
		},
		prepend() {
			return !!this.$slots.prepend;
		},
		append() {
			return !!this.$slots.append;
		},
		showsuffix() {
			return (this.suffix || this.$slots.suffix) && !this.isClearable;
		},
		showprefix() {
			return this.prefix || this.$slots.prefix;
		},
		iconWrapClass() {
			return `${this._tobogPrefix_}-iconwraper`;
		},
		iconClass() {
			return `${this._tobogPrefix_}-icon`;
		},
		iconClasses() {
			return `${this.iconWrapClass} ${this.iconClass}`;
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-with-prepend`]: this.prepend,
					[`${_tobogPrefix_}-with-append`]: this.append,
					[`${_tobogPrefix_}-multiple`]: this.multiple,
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
				},
			];
		},
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-readonly`]: this.readonly && !this.disabled,
				},
			];
		},
		isClearable() {
			return !this.isReadonly && this.clearable && this.model !== '' && this.clearStatus;
		},
	},
	methods: {
		handleIconClick(event) {
			this.$emit('on-icon-click', this.model, event);
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},
		handlePendWidth(type) {
			return {
				width: this.handleFixStyle(type)
			}
		},
		handleFixStyle(type) {
			const width = (this.$refs[type] || {}).offsetWidth;
			if (width) return `${width}px`;
			return "";
		},
		handleInputStyle() {
			const inputStyle = this.inputStyle || {},
				paddingLeft = this.handleFixStyle('prefix'),
				paddingRight = this.handleFixStyle('suffix');
			if (typeof inputStyle === 'string') {
				return `padding-left:${paddingLeft};padding-right:${paddingLeft};${inputStyle}`
			} else {
				return { paddingLeft, paddingRight, ...inputStyle }
			}
		},
	},
}