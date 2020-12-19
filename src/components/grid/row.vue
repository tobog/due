<template>
	<div :class="classes" :style="styles" :data-vue-module="$options.name">
		<slot></slot>
	</div>
</template>

<script>
import { getClientSize, EventListener } from '../../utils/dom';
import { debounce } from '../../utils/tool';
export default {
	name: 'Row',
	props: {
		grid: {
			type: [Number, String],
			default: 24,
		},
		gutter: {
			type: [Number, String],
			default: 0
		},
		flex: {
			type: Boolean,
			default: false,
		},
		align: {
			type: String,
			// default:'top'，top，middle，bottom，stretch
		},
		justify: {
			type: String,
			// default:'start'，center，end，space-around，space-between
		},
	},
	data() {
		return {
			size: 1201,
		}
	},
	created() {
		this.getClientSize = debounce(() => {
			const size = getClientSize('viewport');
			this.size = size.width;
		}, 100);
	},
	mounted() {
		this.bindResize();
	},
	activated() {
		this.bindResize();
	},
	deactivated() {
		this.destroy()
	},
	beforeDestroy() {
		this.destroy()
	},
	watch: {
		grid(val) {
			if (val != 24 && this._isMounted) {
				this.bindResize()
			} else {
				this.destroy()
			}
		}
	},
	methods: {
		destroy() {
			if (this.__bindresize__) EventListener.off(window, 'resize', this.getClientSize);
			this.__bindresize__ = false;
		},
		bindResize() {
			if (this.isCustomeGrid && !this.__bindresize__) {
				this.__bindresize__ = true;
				this.getClientSize();
				EventListener.on(window, 'resize', this.getClientSize);
			}
		},
	},
	computed: {
		isCustomeGrid() {
			return this.grid && this.grid != 24
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-flex`]: this.flex,
					[`${_tobogPrefix_}-${this.align}`]: !!this.align,
					[`${_tobogPrefix_}-${this.justify}`]: !!this.justify,
				}
			]
		},
		styles() {
			let style = {},
				gutter = this.gutter;
			if (gutter && gutter != '0') {
				style.marginLeft = style.marginRight = `${gutter / -2}px`;
			}
			return style;
		}
	},

};
</script>
