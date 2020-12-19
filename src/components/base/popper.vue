
<template>
	<transition name="fade" appear :data-vview-module="$options.name">
		<section
			ref="popper"
			:class="_tobogPrefix_"
			:x-placement="placementinner"
			v-offset-dom="{reference:getReference,options}"
			@mouseenter.stop="handleVisible(true)"
			@mouseleave.stop="handleVisible(false)"
		>
			<span :class="_tobogPrefix_ + '-arrow'" :x-placement="placementinner"></span>
			<slot>{{ content }}</slot>
		</section>
	</transition>
</template>
<script>

import OffsetDom from '../../directives/offset-dom';


export default {
	name: 'Popper',
	directives: { OffsetDom },
	props: {
		reference: [String, HTMLElement],
		placement: {
			type: String,//top,left,bottom,right,center
			default: 'bottom-left',
		},
		content: {
			default: '',
		},
		transfer: {
			type: Boolean,
			default: false,
		},
		offset: {
			type: [String, Number],
			default: 5
		},
		gpu: Boolean,
	},
	data() {
		return {
			placementinner: this.placement,
		};
	},
	computed: {
		getReference() {
			if (this.reference instanceof HTMLElement) return this.reference;
			return (this.$parent.$refs || {})[this.reference];
		},
		options() {
			return {
				callback: this.handlePosition,
				placement: this.placement,
				offset: this.offset,
				gpu: this.gpu,
				transfer: this.transfer,
			}
		},
	},
	methods: {
		handlePosition(data, el, ref) {
			const popper = this.$refs.popper,
				reference = this.getReference;
			if (!popper || !reference) return;
			this.placementinner = data.placement.join('-');
		},
		handleVisible(visible) {
			this.$emit('on-visible-change', visible, 'popper');
		},
	},
};
</script>
