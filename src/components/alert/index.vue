<template>
	<transition name="fade" appear @after-leave="afterLeave">
		<section v-if="!closed" :class="wrapClasses" :data-vue-module="$options.name">
			<template v-if="showIcon">
				<slot name="icon">
					<Icons :type="iconType" :class="[_tobogPrefix_+'-icon']"></Icons>
				</slot>
			</template>
			<div :class="[_tobogPrefix_+'-content']">
				<slot></slot>
				<div v-if="showDesc" :class="[_tobogPrefix_+'-desc']">
					<slot name="desc">{{desc}}</slot>
				</div>
			</div>
			<span v-if="closable" :class="[_tobogPrefix_+'-close']" @click="close">
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
			type: String,
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
		desc: String,
		align: String
	},
	data() {
		return {
			closed: false,
		};
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.type}`]: !!this.type,
					[`${_tobogPrefix_}-with-desc`]: this.showDesc,
					[`${_tobogPrefix_}-ghost`]: this.ghost,
					[`${_tobogPrefix_}-align-${this.align}`]: !!this.align,
				}
			];
		},
		showDesc() {
			return !!this.desc || !!this.$slots.desc
		},
		iconType() {
			const iconMap = {
				success: 'checkmark-circle',
				info: 'information-circle',
				warning: 'alert',
				error: 'close-circle',
				loading: 'loading',
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
