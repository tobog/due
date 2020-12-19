
<template>
	<transition :name="transitionName" appear>
		<aside :data-vue-module="$options.name" :class="[_tobogPrefix_]" :data-name="name" :data-type="type">
			<!-- <div :class="[_tobogPrefix_]" :name="name"> -->
			<slot>{{content}}</slot>
			<render-cell v-if="!!renderFunc" :render="renderFunc" />
			<Icons
				v-if="closable"
				type="ios-close"
				:class="[_tobogPrefix_ + '-close']"
				size="1.5em"
				@click.native="close"
			></Icons>
			<!-- </!-->
		</aside>
	</transition>
</template>

<script>
import RenderCell from '../render';
import Icons from '../../icons/index';
export default {
	name: 'NoticeBase',
	inheritAttrs:false,
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
		onClose: Function,
		type:String
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
