<template>
	<li :class="wrapClasses">
		<component
			:is="getTag"
			:class="contentClasses"
			:style="setTitleStyle"
			@click="handleOpen"
			v-bind="handleProps"
		>
			<slot name="title"></slot>
			<Icons v-if="$slots.default" center :type="icon" :class="[_tobogPrefix_+'-drop-icon']" />
		</component>
		<template v-if="$slots.default">
			<vTransition v-if="isVerticalMode">
				<ul v-if="isOpened" :class="[_tobogPrefix_+'-drop-wrapper']">
					<slot></slot>
				</ul>
			</vTransition>
			<ul v-else :class="dropClasses" :style="getFixedDrop()">
				<slot></slot>
			</ul>
		</template>
	</li>
</template>

<script>
import vTransition from "../base/vTransition";
import Icons from '../icons/index';
import { findComponentUpward } from '../../utils/findComponent';

export default {
	inheritAttrs: false,
	name: "MenuItem",
	components: {
		Icons,
		vTransition,
	},
	props: {
		name: {
			type: String,
			default: '',
		},
		icon: {
			type: String,
			default: 'ios-arrow-down'
		},
		mode: {
			type: String,
			// default: 'vertical'
		},
		align: {
			type: String,
			default: 'center'//fixed,center,left,right,fix,aside
		},
		always: {
			type: Boolean,
			default: false,
		},
		expand: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			active: false,
			ready: false,
			opened: this.expand,
			deep: 0,
		};
	},
	created() {
		this.initContext();
	},
	mounted() {
		this.$nextTick(() => {
			this.ready = true;
		})
	},
	computed: {
		isVerticalMode() {
			return (this.mode || this.__Menu__ && this.__Menu__.mode) === 'vertical';
		},
		isAlways() {
			return this.always || this.__Menu__ && this.__Menu__.always;
		},
		isOpened() {
			return this.opened || this.isAlways;
		},
		getName() {
			return this.name || this._uid
		},
		setTitleStyle() {
			if (this.deep > 0) {
				return {
					paddingLeft: (this.deep + 1) * 16 + 'px'
				}
			}
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-fix`]: this.align === 'fix',
					[`${_tobogPrefix_}-aside-fix`]: this.align === 'aside-fix',
					[`${_tobogPrefix_}-open`]: this.isOpened,
					[`${_tobogPrefix_}-vertical`]: this.isVerticalMode,
				}
			];
		},
		contentClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-title`,
				{
					[`${_tobogPrefix_}-active`]: this.active || this.getActive(),
					[`${_tobogPrefix_}-title-open`]: this.isOpened,
				}
			];
		},
		dropClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-drop`,
				{
					[`${_tobogPrefix_}-drop-${this.align}`]: !!this.align,
				}
			];
		},
		getTag() {
			const props = this.handleProps;
			return props.tag || "div";
		},
		handleProps() {
			let props = this.$attrs,
				{ tag, to } = props;
			if (tag) return props;
			if (to) tag = "router-link";
			return { ...props, tag };
		},
	},
	methods: {
		initContext() {
			this.__Menu__ = findComponentUpward(this, 'Menu');
			if (!this.isVerticalMode) return;
			this.__MenuItem__ = findComponentUpward(this, 'MenuItem');
			if (this.__MenuItem__) {
				this.deep = this.__MenuItem__.deep + 1;
			}
			if (this.__Menu__) {
				this.__Menu__.__MenuItems__.push(this);
			}
		},
		updateOpen(bool = false) {
			if (this.__MenuItem__) {
				this.__MenuItem__.opened = bool;
				this.__MenuItem__.updateOpen(bool);
			}
		},
		getActive() {
			return this.__Menu__ && this.__Menu__.activeName === this.getName;
		},
		getFixedDrop() {
			if (this.align === 'fixed' && this.ready) {
				return {
					top: this.$el.offsetHeight + 'px'
				}
			}
		},
		handleOpen() {
			const name = this.getName, Menu = this.__Menu__;
			if (this.isVerticalMode && this.$slots.default && !this.isAlways) {
				const opened = this.opened;
				if (Menu && !Menu.multiple) {
					Menu.updateOpen(false);
					this.updateOpen(true);
				}
				this.opened = !opened;
				if (Menu) Menu.$emit('on-open-change', name, this.opened);
				return;
			}
			if (Menu) {
				Menu.activeName = name;
				Menu.$emit('on-select', name);
			}
		},

	},
	beforeDestroy() {
		if (this.__Menu__) {
			const index = this.__Menu__.__MenuItems__.indexOf(this);
			if (index > -1) this.__Menu__.__MenuItems__.splice(index, 1);
		}
	},

};
</script>