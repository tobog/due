
<template>
	<section tabindex="-1" :class="[_tobogPrefix_]" :data-vue-module="$options.name">
		<slot></slot>
		<template v-if="ready">
			<Popper
				type="popper"
				:gpu="gpu"
				:reference="getReference"
				:placement="placement"
				:offset="offset"
				:transfer="transfer"
				:always="always"
				:delay="delay"
				:class="popperClasses"
				:style="popperStyle"
				:trigger="trigger"
				@on-visible-change="handleVisible"
			>
				<slot name="content">
					{{content}}
				</slot>
			</Popper>
		</template>
	</section>
</template>
<script>
import Popper from '../base/popper';

export default {
	name: 'Tooltip',
	components: { Popper },
	props: {
		trigger: {
			type: String,
			default: 'click',
		},//'hover,click'
		gpu: {
			type: Boolean,
			default: true,
		},
		transfer: Boolean,
		disabled: Boolean,
		content: String,
		always: Boolean,
		popperStyle: [String, Object],
		popperClass: [String, Array],
		theme: {
			type: String,//dark,light ,
			default: 'dark',
		},
		delay: {
			type: Number,
			default: 0
		},
		offset: {
			type: [String, Number],
			default: 10
		},
		placement: {
			type: String,
			default: "top-center"
		},
		reference: HTMLElement,
	},
	data() {
		return {
			ready: false,
		}
	},
	mounted() {
		this.ready = true;
	},
	computed: {
		popperClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				this.popperClass,
				`${_tobogPrefix_}-drop`,
				{
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme
				}
			];
		},
		getReference() {
			if (!this.ready) return;
			if (this.reference instanceof HTMLElement) return this.reference;
			return this.$el;
		},
	},
	methods: {
		handleVisible(...args) {
			this.$emit('on-visible-change', ...args)
		}
	},
};
</script>
