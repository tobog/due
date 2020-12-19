
<template>
	<transition :name="transitionName" appear>
		<div :data-vview-module='$options.name'>
			<div :class="_tobogPrefix_" :name="name">
			    <slot><div v-if="content" v-html="content"></div></slot>
				<render-cell v-if="!!renderFunc" :render="renderFunc"/>
				<Icons v-if="closable" type="ios-close" :class="_tobogPrefix_ + '-close'" size="22" @click.native="close"></Icons>
			</div>
		</div>
	</transition>
</template>

<script>
import RenderCell from '../render';
import Icons from '../../icons/index';
export default {
	name: 'NoticeBase',
	components: {
		RenderCell,
		Icons,
	},
	props: {
		duration: {
			type: [Number, String],
			default: 1.5,
		},
		name: {
			required: true,
		},
		content: String,
		render: Function,
		closable: Boolean,
		transitionName: String,
		onClose: {
			type: Function,
			default: function () { }
		},
	},
	computed: {
		renderFunc() {
			return this.render || false;
		},
	},
	methods: {
		clearTime() {
			if (this.__closeTime) {
				clearTimeout(this.__closeTime);
				this.__closeTime = null;
			}
		},
		close() {
			this.clearTime();
			this.$parent.remove(this.name);
			if (typeof this.onClose === 'function') this.onClose();
		},
	},
	mounted() {
		this.clearTime();
		const duration = this.duration * 1000;
		if (!!duration) {
			this.__closeTime = setTimeout(() => {
				this.close();
			}, duration);
		}
	},
	beforeDestroy() {
		this.clearTime();
		this.__closeTime = null;
	}
};
</script>
