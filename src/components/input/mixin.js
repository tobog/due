
import { validVal } from '../../utils/tool'
import Emitter from '../../utils/emitter';
import langMinix from '../../mixins/lang'
export default {
	mixins: [Emitter, langMinix],
	props: {
		value: {
			// type:String,
			default: ""
		},
		name: String,
		suffix: String,
		prefix: String,
		clearable: Boolean,
		readonly: Boolean,
		disabled: Boolean,
		theme: String,
		ellipsis:Boolean,
	},
	data() {
		return {
			model: '',
			ready: false,
			isActive: false,
			show: false,
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.ready = true;
		});
		// this.handleDispatch('on-change', this.model);
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
		showSuffix() {
			return !!(this.suffix || this.$slots.suffix);
		},
		showPrefix() {
			return !!(this.prefix || this.$slots.prefix);
		},
		iconClass() {
			return `${this._tobogPrefix_}-icon`;
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
					[`${_tobogPrefix_}-ellipsis`]: this.ellipsis
				},
			];
		},
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-active`]: this.show || this.isActive,
					[`${_tobogPrefix_}-open`]: this.show && !this.isReadonly,
					[`${_tobogPrefix_}-readonly`]: this.readonly,
					[`${_tobogPrefix_}-clear`]: this.isClearable,
					[`${_tobogPrefix_}-radius-left`]: !this.prepend,
					[`${_tobogPrefix_}-radius-right`]: !this.append,
				},
			];
		},
		clearClass() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-icon`,
				`${_tobogPrefix_}-clearicon`,
			]
		},
		isClearable() {
			return !this.isReadonly && this.clearable && ((Array.isArray(this.model) && this.model.length) || validVal(this.model));
		},
	},
	methods: {
		handleIconClick(event) {
			this.$emit('on-icon-click', this.model, event);
		},
		handleDispatch(...args) {
			if (this.__parentComponent__) {
				this.__parentComponent__.$emit(...args)
			} else {
				this.__parentComponent__ = this.dispatch('FormItem', ...args)
			}
		},
	},
}