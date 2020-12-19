<template>
	<ul :class="classes">
		<slot></slot>
	</ul>
</template>
<script>
export default {
	name: 'Timeline',
	props: {
		pending: {
			type: Boolean,
			default: false
		},
		mode: {
			type: String,
			default: 'vertical'//horizontal,vertical
		}
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}`,
				{
					[`${_tobogPrefix_}-pending`]: this.pending,
					[`${_tobogPrefix_}-horizontal`]: this.mode === 'horizontal'
				}
			];
		}
	}
};
</script>
