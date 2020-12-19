

<template>
	<span :class="_tobogPrefix_" :data-vview-module="$options.name">
		<component :is="getTag" v-bind="$attrs" :class="innerClasses">
			<slot></slot>
		</component>
		<span v-if="visible" :class="sepClasses">
			<slot name="sep">
				<span v-html="separator"></span>
			</slot>
		</span>
	</span>
</template>

<script>
export default {
	name: 'BreadItem',
	inheritAttrs: false,
	props: {
		sep: String
	},
	data() {
		return {
			separator: this.sep,
			visible: true
		};
	},
	created() {
		this.$parent.updateChildren();
	},
	computed: {
		innerClasses() {
			const { to, href } = this.$attrs;
			return `${this._tobogPrefix_}-${(to || href) ? 'link' : 'item'}`
		},
		getTag() {
			const { to, href, tag = 'span' } = this.$attrs;
			if (to) return 'router-link';
			if (href) return 'a';
			return tag;
		},
		sepClasses() {
			return `${this._tobogPrefix_}-sep`;
		}
	},
	beforeDestroy() {
		this.$parent.updateChildren();
	},

};
</script>
