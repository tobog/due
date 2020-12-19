
<template>
	<transition name="fade" appear :data-vview-module="$options.name">
		<section v-transfer-dom="transfer" :data-transfer="transfer">
			<transition name="fade" appear @after-leave="afterLeave">
				<div v-show="visible" :class="wrapClasses" @click.self="clickMask" allowfullscreen ref="wrap">
					<transition :name="transitionname" appear>
						<div
							v-if="visible"
							v-drag-move="dragable"
							ref="modal"
							allowfullscreen
							:class="contentClasses"
							:style="contentStyles"
						>
							<span :class="_tobogPrefix_ + '-icons'">
								<template v-if="fullscreen">
									<Icons
										size="20"
										:class="_tobogPrefix_+'-full'"
										@click.native="handleFullscreen"
										type="ios-expand"
									></Icons>
									<Icons
										size="20"
										:class="_tobogPrefix_+'-exit'"
										@click.native="handleFullscreen"
										type="ios-contract"
									></Icons>
								</template>
								<template v-if="closable">
									<slot name="close">
										<Icons type="ios-close" size="27" @click.native="close"></Icons>
									</slot>
								</template>
							</span>
							<div v-if="showHeader" :class="headerClasses" ref="header">
								<slot name="header">
									<Icons v-if="prompt" type="info" style="margin-right:5px;"></Icons>
									{{title}}
								</slot>
							</div>
							<div :class="_tobogPrefix_ + '-body'" ref="body">
								<slot></slot>
							</div>
							<footer v-if="showFooter" :class="_tobogPrefix_ + '-footer'" ref="footer">
								<template v-if="!prompt">
									<slot name="footer" :close="close" :confirm="confirm">
										<Button size="small" @click="close" style="margin-right:16px">{{langs.close}}</Button>
										<Button theme="primary" size="small" @click="confirm">{{langs.confirm}}</Button>
									</slot>
								</template>
								<Button v-else :theme="prompt" size="large" long @click.native="confirm">{{langs.confirm}}</Button>
							</footer>
							<Loading v-if="loading" loading fix @on-close="loading=false" />
						</div>
					</transition>
				</div>
			</transition>
		</section>
	</transition>
</template>

<script>
import TransferDom from '../../directives/transfer-dom';
import DragMove from '../../directives/drag-move';
import { EventListener, Fullscreen } from '../../utils/dom';
import Icons from '../icons/index';
import Button from '../button/index';
import Loading from '../loading/loading';
export default {
	name: 'Modal',
	inheritAttrs: false,
	directives: {
		TransferDom,
		DragMove
	},
	components: {
		Icons,
		Button,
		Loading
	},

	props: {
		name: [String, Number],
		value: [Boolean, String],
		// icon: String,
		title: String,
		styles: [Object, String],
		type: {
			type: String,//modal,drawer
			default: "modal"
		},
		width: {
			type: [String, Number],
			default: 520,
		},
		maskable: {
			type: Boolean,
			default: false,
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showFooter: {
			type: Boolean,
			default: true,
		},
		closable: {
			type: Boolean,
			default: true,
		},
		transfer: {
			type: Boolean,
			default: true,
		},
		dragable: {
			type: Boolean,
			default: false,
		},
		fullscreen: {
			type: Boolean,
			default: false,
		},
		fullElement: {
			type: String,
			default: "modal"//wrap,modal
		},
		delay: {
			type: Number,
			default: 0,
		},
		fixed: Boolean,
		prompt: String,
		async: Boolean
	},
	data() {
		return {
			visible: this.value,
			loading: false
		};
	},
	mounted() {
		EventListener.on(document, 'keydown', this.escClose);
		this.$nextTick(() => {
			this.handleBodyHeight();
		})
	},
	activated() {
		EventListener.on(document, 'keydown', this.escClose);
	},
	deactivated() {
		EventListener.off(document, 'keydown', this.escClose);
	},
	watch: {
		value(val) {
			this.delayToggle(val);
		},
		visible: {
			immediate: true,
			handler(val, old) {
				this.handleOverflow(val);
				this.$emit('on-visible-change', val, this.name);
				this.$nextTick(() => {
					if (!val && val !== old && !this.__destroyed__ && this.$attrs.autoDestroy && typeof this.$options.destroy === 'function' && this.$attrs.__pattern === 'js') {
						this.__destroyed__ = true;
						if (this.__offsetParent) this.__offsetParent.style.overflow = '';
						this.$options.destroy(this.name);
					}
				})
			}
		},
	},
	computed: {
		langs() {
			const lang = {
				'close': '关闭',
				'confirm': '确认',
			}
			if (typeof this.$t !== 'function') return lang;
			const langPrefix = this.__$langPrefix__,
				obj = {};
			Object.keys(lang).forEach((key) => {
				let langKey = `${langPrefix}.modal.${key}`;
				langKey = (this.__$langMap__ && this.__$langMap__[langKey]) ? this.__$langMap__[langKey] : langKey;
				const value = this.$t(langKey)
				obj[key] = langKey === value ? lang[key] : value;
			})
			return obj;
		},
		headerClasses() {
			return [`${this._tobogPrefix_}-header`, {
				[`${this._tobogPrefix_}-${this.prompt}`]: this.prompt,
			}];
		},
		transitionname() {
			return this.type === 'drawer' ? 'move-right' : 'slide-up'
		},
		wrapClasses() {
			return `${this._tobogPrefix_}-wrap ${this._tobogPrefix_}-mask`;
		},
		contentClasses() {
			const _tobogPrefix_ = this._tobogPrefix_, type = this.type;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-drawer`]: type === 'drawer',
				}
			];
		},
		contentStyles() {
			let width = this.width;
			if (width) width = parseFloat(width) == width ? `${width}px` : width;
			if (typeof styles == 'string') {
				return `width:${width};${this.styles}`;
			}
			return { width, ...this.styles };
		},
	},
	methods: {
		handleOverflow(val) {
			clearTimeout(this.__timeout2);
			this.__timeout2 = setTimeout(() => {
				this.__offsetParent = this.$el.offsetParent || this.__offsetParent;
				if (this.__offsetParent) this.__offsetParent.style.overflow = val ? 'hidden' : '';
			}, 200);
		},
		handleBodyHeight() {
			if (!this._isMounted || !this.fixed) return;
			const refs = this.$refs, body = refs.body;
			if (!body) return;
			this.$nextTick(() => {
				const wrapHeight = (refs.modal || {}).offsetHeight || 0,
					headerHeight = (refs.header || {}).offsetHeight || 0,
					footerHeight = (refs.footer || {}).offsetHeight || 0,
					style = body.style;
				style.height = wrapHeight - headerHeight - footerHeight + 'px';
				style.overflow = 'auto';
			})
		},
		handleFullscreen() {
			// 整个页面进入全屏
			const ele = this.$refs[this.fullElement === 'modal' ? 'modal' : 'wrap'];
			Fullscreen.toggle(ele).then((bool) => {
				this.$emit('on-fullscreenchange', bool);
			});
		},
		clickMask() {
			if (this.maskable) this.close();
		},
		close() {
			this.visible = false;
			this.$emit('on-cancel', this.name);
		},
		afterLeave() {
			this.$emit('input', false);
			this.$emit('on-after-close', this.name);
		},
		confirm() {
			if (!this.async) this.visible = false;
			this.loading = true;
			this.$emit('on-confirm', this.name);
		},
		escClose(e) {
			if (this.value && this.closable && e.keyCode === 27) this.close();
		},
		delayToggle(val) {
			clearTimeout(this.__timeOut);
			if (this.visible === val) return;
			this.loading = false;
			if (val) this.visible = true;
			if (this.delay) {
				this.loading = true;
				this.__timeOut = setTimeout(() => {
					this.visible = val;
					this.loading = false;
					this.__timeOut = null;
				}, this.delay);
			} else {
				this.visible = val;
			}
		},
	},
	beforeDestroy() {
		clearTimeout(this.__timeout2);
		EventListener.off(document, 'keydown', this.escClose);
		if (!this.__destroyed__ && typeof this.$options.destroy === 'function' && this.$attrs.__pattern === 'js') this.$options.destroy(this.name);
		this.__timeOut = this.__timeout2 = null;
		if (this.__offsetParent) this.__offsetParent.style.overflow = '';
	},
};
</script>
