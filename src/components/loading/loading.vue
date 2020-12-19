
<template>
	<transition name="fade">
		<section v-if="visible" :class="classes" :allowfullscreen="fullscreen">
			<aside :class="[_tobogPrefix_+'-icons']">
				<template v-if="fullscreen">
					<Icons :class="[_tobogPrefix_+'-full']" @click.native="handleFullscreen" type="expand"></Icons>
					<Icons :class="[_tobogPrefix_+'-exit']" @click.native="handleFullscreen" type="contract"></Icons>
				</template>
				<Icons v-if="closable" @click.native="close" size="1.6em" type="ios-close"></Icons>
			</aside>
			<div :class="[_tobogPrefix_]">
				<slot>
					<span :class="[_tobogPrefix_+'-dot']"></span>
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
			visible: false,
		};
	},
	mounted() {
		this.visible = this.loading
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-fix`]: this.fix || this.transfer,
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
				this.$options.destroy();
			}
		},
		handleFullscreen() {
			Fullscreen.toggle(this.$el).then((bool) => {
				this.$emit('on-fullscreenchange', bool);
			});
		},
		handleOverflow(val) {
			if (!((val && !this._isOverflowed_) || (!val && this._isOverflowed_)) || !this._isMounted) {
				return
			}
			this.__offsetParent = this.__offsetParent || this.$el.offsetParent || document.body;
			const dataset = this.__offsetParent.dataset,
				overflowIndex = parseInt(dataset.overflowIndex || 0),
				style = this.__offsetParent.style,
				originOverflow = dataset.originOverflow;
			if (val) {
				this._isOverflowed_ = true;
				dataset.overflowIndex = overflowIndex + 1;
				if (originOverflow === undefined) dataset.originOverflow = style.overflow || '';
				style.overflow = 'hidden';
				return;
			}
			this._isOverflowed_ = false;
			if (overflowIndex < 2) {
				style.overflow = originOverflow;
				delete dataset.originOverflow;
				delete dataset.overflowIndex;
				return;
			}
			dataset.overflowIndex = overflowIndex - 1;
		}
	},
	watch: {
		visible: {
			handler(val, old) {
				if (!this._isInserted) {
					this.$nextTick(() => {
						this._isInserted = true;
						this.handleOverflow(val);
					})
				} else {
					this.handleOverflow(val);
				}
			}
		},
		loading(val, old) {
			val = !!val;
			clearTimeout(this.__timeout);
			if (!val && this.delay > 0) {
				this.__timeout = setTimeout(() => {
					this.visible = val;
					this.__timeout = null;
				}, this.delay);
			} else {
				this.visible = val;
			}
		},
	},
	beforeDestroy() {
		clearTimeout(this.__timeout);
		if (this.visible) this.handleOverflow(false);
		this.__timeout = null;
	},
};
</script>
