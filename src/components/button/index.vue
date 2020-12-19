
<template>
	<component
		:is="getTag"
		:data-vue-module="$options.name"
		:class="classes"
		:type="type"
		v-on="$listeners"
		v-bind="$attrs"
	>
		<template v-if="showIcon">
			<slot name="icon">
				<Icons :type="getIcon"></Icons>
			</slot>
		</template>
		<slot></slot>
	</component>
</template>
<script>
import Icons from '../icons/index';
export default {
	name: 'Button',
	inheritAttrs: false,
	components: { Icons },
	props: {
		theme: {
			type: String,
			// validator(value) {
			// 	return oneOf(value, [
			// 		'primary',
			// 		'dashed',
			// 		'text',
			// 		'info',
			// 		'success',
			// 		'warning',
			// 		'error',
			// 		'default',
			// 	]);
			// },
			// default: '',
		},
		size: {
			// validator(value) {
			// 	return oneOf(value, ['small', 'large', 'default']);//60...
			// },
			// default: 'default',
			type: String,
		},
		type:{
			type: String,
			default:'button',
		},
		shape: String,
		icon: String,
		ghost: Boolean,
		long: Boolean,
		loading: Boolean,
		disabled: Boolean,
	},
	computed: {
		getTag() {
			const { to, href, tag = 'button' } = this.$attrs;
			if (to) return this.$router ? 'router-link' : 'a';
			if (href) return 'a';
			return tag;
		},
		showIcon() {
			return this.$slots.icon || this.icon || this.loading
		},
		getIcon() {
			return this.icon || this.loading && 'loading'
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-loading`]: this.icon === 'loading' || this.loading,
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-${this.shape}`]: !!this.shape,
					[`${_tobogPrefix_}-size-${this.size}`]: this.size === 'small' || this.size === 'large',
					[`${_tobogPrefix_}-ghost`]: this.ghost,
					[`${_tobogPrefix_}-long`]: this.long,
					[`${_tobogPrefix_}-disabled`]: this.disabled,
				},
			];
		},
	},
};
</script>
