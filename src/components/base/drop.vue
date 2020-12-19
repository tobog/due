<template>
	<transition appear :data-vue-module="$options.name" :name="transition" v-on="transitionListeners">
		<div ref="drop" :class="[_tobogPrefix_]" v-offset-dom="{reference,options}" v-on="listeners">
			<slot></slot>
		</div>
	</transition>
</template>

<script>
// v-transfer-dom="transfer"
//多次跟新有抖动问题 transfer影响
import OffsetDom from '../../directives/offset-dom';

export default {
	name: 'Drop',
	inheritAttrs: false,
	directives: {
		OffsetDom,
	},
	props: {
		transfer: Boolean,
		reference: HTMLElement,
		transition: {
			type: String,
			default: 'transition-drop',
		},
	},
	data() {
		return {}
	},
	computed: {
		options() {
			return {
				transfer: this.transfer,
				...this.$attrs,
			}
		},
		transitionListeners() {
			const listeners = {};
			[
				'before-enter', 'before-leave', 'before-appear',
				'enter', 'leave', 'appear',
				'after-enter', 'after-leave', 'after-appear',
				'enter-cancelled', 'leave-cancelled', 'appear-cancelled'
			].forEach((key) => {
				const listener = this.$listeners[key]
				if (listener) listeners[key] = listener;
			});
			return listeners;
		},
		listeners() {
			const listeners = { ...this.$listeners };
			[
				'before-enter', 'before-leave', 'before-appear',
				'enter', 'leave', 'appear',
				'after-enter', 'after-leave', 'after-appear',
				'enter-cancelled', 'leave-cancelled', 'appear-cancelled'
			].forEach((key) => {
				if (listeners[key]) delete listeners[key];
			});
			return listeners;
		},
	},
};
</script>
