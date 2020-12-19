
<template>
	<transition name="fade" appear :data-vue-module="$options.name">
		<section
			v-transfer-dom="transfer"
			v-show="visible"
			:data-transfer="transfer"
			:class="wrapClasses"
			:allowfullscreen="fullscreen"
			@click.self="clickMask"
			ref="wrap"
		>
			<transition :name="transitionname" appear @after-leave="afterLeave">
				<div
					v-if="visible"
					ref="modal"
					:allowfullscreen="fullscreen"
					:class="contentClasses"
					:style="contentStyles"
				>
					<span :class="[_tobogPrefix_ + '-icons']">
						<template v-if="fullscreen">
							<Icons :class="[_tobogPrefix_+'-full']" @click.native="handleFullscreen" type="ios-expand"></Icons>
							<Icons :class="[_tobogPrefix_+'-exit']" @click.native="handleFullscreen" type="ios-contract"></Icons>
						</template>
						<template v-if="closable">
							<slot name="close">
								<Icons type="ios-close" size="1.6em" @click.native="close"></Icons>
							</slot>
						</template>
					</span>
					<div v-if="showHeader" :class="headerClasses" ref="header">
						<slot name="header">
							<Icons v-if="prompt" type="info"></Icons>
							{{title}}
						</slot>
					</div>
					<div :class="[_tobogPrefix_ + '-body']" ref="body">
						<slot></slot>
					</div>
					<div v-if="showFooter" :class="[_tobogPrefix_ + '-footer']" ref="footer">
						<template v-if="!prompt">
							<slot name="footer" :close="close" :confirm="confirm">
								<Button
									size="small"
									@click.native="close"
									style="margin-right:16px"
								>{{langs('modal.close','关闭')}}</Button>
								<Button theme="primary" size="small" @click.native="confirm">{{langs('modal.confirm','确认')}}</Button>
							</slot>
						</template>
						<Button v-else :theme="prompt" long @click.native="confirm">{{langs('modal.confirm','确认')}}</Button>
					</div>
					<Loading v-if="loading" loading fix @on-close="loading=false" />
				</div>
			</transition>
		</section>
	</transition>
</template>

<script>
import TransferDom from '../../directives/transfer-dom';
import { EventListener, Fullscreen, DragMove } from '../../utils/dom';
import { unit, validVal } from '../../utils/tool';
import Icons from '../icons/index';
import Button from '../button/index';
import Loading from '../loading/loading';
import langMinix from '../../mixins/lang'
export default {
	name: 'Modal',
	inheritAttrs: false,
	mixins: [langMinix],
	directives: {
		TransferDom
	},
	components: {
		Icons,
		Button,
		Loading
	},
	props: {
		name: [String,Number],
		value: Boolean,
		title: String,
		modalStyle: [Object, String],
		type: {
			type: String,//modal,drawer
			default: "modal"
		},
		width: {
			type: Number,
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
			default: false,
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
		async: Boolean,
		position: Array,
	},
	data() {
		return {
			visible: this.value,
			loading: false
		};
	},
	mounted() {
		this.visible = this.visible ? 1 : 0;
		EventListener.on(document, 'keydown', this.escClose);
	},
	activated() {
		EventListener.on(document, 'keydown', this.escClose);
	},
	deactivated() {
		EventListener.off(document, 'keydown', this.escClose);
	},

	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				`${_tobogPrefix_}-mask`,
				{
					[`${_tobogPrefix_}-fixed`]: this.fixed,
				}
			]
		},
		headerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-header`,
				{
					[`${_tobogPrefix_}-${this.prompt}`]: !!this.prompt,
				}
			];
		},
		contentClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-drawer`]: this.type === 'drawer',

				}
			];
		},
		transitionname() {
			return this.type === 'drawer' ? 'move-right' : 'slide-up'
		},

		contentStyles() {
			const style = this.modalStyle || "",
				width = unit(this.width),
				[top, right, bottom, left] = this.position || [],
				margin = this.type === 'drawer' ? '' : [
					validVal(top) ? unit(top) : 'auto',
					validVal(right) ? unit(right) : 'auto',
					validVal(bottom) ? unit(bottom) : 'auto',
					validVal(left) ? unit(left) : 'auto',
				].join(' ');
			return typeof style == 'string' ? `width:${width};margin:${margin};${style}` : {
				width,
				margin,
				...style,
			}
		},
	},
	methods: {
		dragMove() {
			if (!this.dragable || !this.visible) return;
			this.$nextTick(() => {
				if (this._DragMove) {
					this._DragMove.update(this.$refs.modal)
					return
				}
				this._DragMove = new DragMove(this.$refs.modal);
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
			this.$emit('on-confirm', this.name,()=>{
				this.visible=false;
			});
		},
		escClose(e) {
			if (this.visible && this.closable && e.keyCode === 27) this.close();
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
		},
	},
	watch: {
		dragable(val, old) {
			if (val == old) return;
			this.dragMove();
		},
		value(val, old) {
			this.delayToggle(val);
		},
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
				this.dragMove();
				this.$nextTick(() => {
					if (!val && old && this.$attrs.autoDestroy && typeof this.$options.destroy === 'function' && this.$attrs.__pattern === 'js') {
						this.__destroyed__ = true;
						this.$options.destroy(this.name);
					}
				})
				this.$emit('on-visible-change', val, this.name);
			}
		},
	},
	beforeDestroy() {
		if (this.visible) this.handleOverflow(false);
		EventListener.off(document, 'keydown', this.escClose);
		clearTimeout(this.__timeout);
		this.__timeout  = null;
		this._DragMove && this._DragMove.destroy();
		if (!this.__destroyed__ && typeof this.$options.destroy === 'function' && this.$attrs.__pattern === 'js') this.$options.destroy(this.name);
	},
};
</script>
