


<template>
	<section
		:class="_tobogPrefix_"
		:data-vview-module="$options.name"
		@mouseenter.stop="handleVisible(true,'hover')"
		@mouseleave.stop="handleVisible(false,'hover')"
		@click="handleVisible(!visible,'click')"
		v-click-outside="{callback:hide,reference:($refs.popper||{}).$el}"
	>
		<slot></slot>
		<template v-if="ready">
			<Popper
				v-show="getVisible"
				ref="popper"
				:gpu="gpu"
				:reference="getReference"
				:placement="placement"
				:offset="offset"
				:transfer="transfer"
				:class="popperClasses"
				:style="popperStyle"
				@on-visible-change="handleVisible"
			>
				<slot name="content"><div v-html="content"></div></slot>
			</Popper>
		</template>
	</section>
</template>
<script>
import Popper from '../base/popper';
import ClickOutside from '../../directives/click-outside';
export default {
	name: 'Tooltip',
	components: { Popper },
	directives: {
		ClickOutside,
	},
	props: {
		trigger: String,//'hover,click'
		transfer: Boolean,
		disabled: Boolean,
		content: String,
		gpu: Boolean,
		always: {
			type: Boolean,
			default: undefined,
		},
		popperStyle: [String, Object],
		popperClass: [String, Array],
		theme: {
			type: String,//dark,light ,
			default: 'dark',
		},
		delay: {
			type: [String, Number],
			default: 200
		},
		offset: {
			type: [String, Number],
			default: 5
		},
		placement: {
			type: String,
			default: "top-center"
		},
		reference: HTMLElement,

	},

	data() {
		return {
			visible: this.always,
			ready: false,
		}
	},
	mounted() {
		this.ready = true;
	},
	computed: {
		getVisible() {
			if (this.always !== undefined) return this.always;
			return this.visible
		},
		popperClasses() {
			return [`${this._tobogPrefix_}-drop`,`${this._tobogPrefix_}-${this.theme}`, this.popperClass];
		},
		getReference() {
			if (!this.ready) return;
			if (this.reference instanceof HTMLElement) return this.reference;
			return this.$el;
		},
	},
	methods: {
		hide(status) {
			if (status) this.handleVisible(false);
		},
		handleVisible(visible, trigger) {
			if ((this.trigger === 'click' && trigger === 'hover') || (this.trigger !== 'click' && trigger === 'click')) return;
			clearTimeout(this.__timeout);
			if (this.disabled || (trigger === 'popper' && this.trigger === 'click')) return;
			if (this.always !== undefined) return this.visible = this.always;
			this.__timeout = setTimeout(() => {
				this.visible = visible;
				this.__timeout = null;
				this.$emit('on-visible-change', visible);
			}, this.delay);
		},
	},
};
</script>
