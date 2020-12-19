<template>
	<ul :class="wrapClasses">
		<slot></slot>
	</ul>
</template>

<script>
export default {
	name: "Menu",
	props: {
		multiple: Boolean,
		always: Boolean,
		mode: {
			type: String,
			// default: "vertical"//horizontal,vertical
		},
		theme: {
			type: String,
			// default: 'primary'//primary,dark,light
		},
	},
	data() {
		return {
			activeName: '',
		};
	},
	created() {
		this.__MenuItems__ = [];
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-vertical`]: this.mode === 'vertical',
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
				}
			];
		},
	},
	methods: {
		updateOpen(bool = false) {
			this.__MenuItems__.forEach(element => {
				element.opened = bool;
			});
		},
	}
};
</script>