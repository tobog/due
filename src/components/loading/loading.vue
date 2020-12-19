
<template>
	<transition name="fade">
		<section v-if="visible" :class="classes" allowfullscreen>
			<aside :class="_tobogPrefix_+'-icons'">
				<Icons v-if="closable" @click.native="close" size="32" type="ios-close"></Icons>
				<template v-if="fullscreen">
					<Icons :class="_tobogPrefix_+'-full'" @click.native="handleFullscreen" type="expand"></Icons>
					<Icons :class="_tobogPrefix_+'-exit'" @click.native="handleFullscreen" type="contract"></Icons>
				</template>
			</aside>
			<div :class="_tobogPrefix_+'-main'">
				<slot>
					<span :class="_tobogPrefix_+'-dot'"></span>
				</slot>
				<slot name="label"></slot>
			</div>
		</section>
	</transition>
</template>
<script>
import Icons from '../icons/index';
import { Fullscreen } from '../../utils/dom'
export default {
	name: 'Loading',
	inheritAttrs: false,
	components: {
		Icons
	},
	props: {
		fix: Boolean,
		transfer: Boolean,
		fullscreen: Boolean,
		loading: Boolean,
		closable: {
			type: Boolean,
			default: true
		},
		delay: Number
	},
	data() {
		return {
			visible: this.loading,
		};
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-fix`]: this.fix,
					[`${_tobogPrefix_}-fixed`]: this.transfer,
				},
			];
		},
	},
	methods: {
		close() {
			this.visible = false;
			this.$emit('on-close');
			if (typeof this.$options.destroy === 'function' && this.$attrs.__pattern === 'js') {
				if (this.__offsetParent) this.__offsetParent.style.overflow = '';
				this.$options.destroy();
			}
		},
		handleFullscreen() {
			// 整个页面进入全屏
			Fullscreen.toggle(this.$el).then((bool) => {
				this.$emit('on-fullscreenchange', bool);
			});
		},
		handleOverflow(val) {
			clearTimeout(this.__timeout2);
			this.__timeout2 = setTimeout(() => {
				this.__offsetParent = this.$el.offsetParent || this.__offsetParent;
				if (this.__offsetParent) this.__offsetParent.style.overflow = val ? 'hidden' : '';
			}, 200);
		}
	},
	watch: {
		visible: {
			immediate: true,
			handler(val) {
				this.handleOverflow(val);
			}
		},
		loading(val, old) {
			if (!val && this.delay > 0) {
				this.__timeout = setTimeout(() => {
					this.visible = val;
				}, this.delay);
			} else {
				this.visible = val;
			}

		},
	},
	beforeDestroy() {
		clearTimeout(this.__timeout);
		clearTimeout(this.__timeout2);
		this.__timeout = this.__timeout2 = null;
		if (this.__offsetParent) this.__offsetParent.style.overflow = '';
	},
};
</script>
