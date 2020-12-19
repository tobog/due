<template>
	<transition name="fade" appear @after-leave="afterLeave">
		<section v-if="!closed" :class="wrapClasses" :data-vview-module="$options.name">
			<template v-if="showIcon">
				<slot name="icon">
					<Icons :type="iconType" :class="_tobogPrefix_+'-icon'"></Icons>
				</slot>
			</template>
			<slot></slot>
			<slot name="desc"></slot>
			<span v-if="closable" :class="_tobogPrefix_+'-close'" @click="close">
				<slot name="close">
					<Icons type="ios-close"></Icons>
				</slot>
			</span>
		</section>
	</transition>
</template>

<script>
import Icons from '../icons/index';

export default {
	name: 'Alert',
	components: {
		Icons
	},
	props: {
		type: {
			default: 'info' // ['success', 'info', 'warning', 'error']
		},
		closable: {
			type: Boolean,
			default: false
		},
		showIcon: {
			type: Boolean,
			default: true
		},
		ghost: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			closed: false,
			desc: false
		};
	},
	mounted() {
		this.desc = this.$slots.desc !== undefined;
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				`${_tobogPrefix_}-default`,
				`${_tobogPrefix_}-${this.type}`,
				{
					[`${_tobogPrefix_}-with-icon`]: this.showIcon,
					[`${_tobogPrefix_}-with-desc`]: this.desc,
					[`${_tobogPrefix_}-ghost`]: this.ghost,
				}
			];
		},
		iconType() {
			const iconMap = {
				success: 'checkmark-circle',
				info: 'information-circle',
				warning: 'alert',
				error: 'close-circle',
				// loading:'loading',
			};
			return iconMap[this.type] || this.type;
		}
	},
	methods: {
		close(e) {
			this.closed = true;
		},
		afterLeave() {
			this.$emit('on-close');
		}
	},

};
</script>
