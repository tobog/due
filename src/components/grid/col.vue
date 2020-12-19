
<template>
	<div :class="_tobogPrefix_" :style="styles" v-show="ready" :data-vview-module="$options.name">
		<slot></slot>
	</div>
</template>
<script>
import { getClientSize, EventListener } from '../../utils/dom';
import { debounce } from '../../utils/tool';
import { findComponentUpward } from '../../utils/findComponent';

export default {
	name: 'Col',
	props: {
		span: [Number, String],
		offset: [Number, String],
		push: [Number, String],
		grid: [Number, String],
		gutter: [Number, String],
		pull: [Number, String],
		xs: [Number, String, Object],
		sm: [Number, String, Object],
		md: [Number, String, Object],
		lg: [Number, String, Object]
	},
	data() {
		return {
			ready: false,
			row: null,
			width: null,
		};
	},
	created() {
		this.row = findComponentUpward(this, 'Row') || {};
		this.getClientSize = debounce(() => {
			const size = getClientSize('viewport');
			this.width = size.width;
		}, 100)
	},
	mounted() {
		this.getClientSize();
		EventListener.on(window, 'resize', this.getClientSize);
		this.ready = true;
	},
	activated() {
		this.getClientSize();
		EventListener.on(window, 'resize', this.getClientSize);
	},
	deactivated() {
		EventListener.off(window, 'resize', this.getClientSize);
	},
	computed: {
		styles() {
			let media = this[this.media] || {},
				type = typeof media;
			if (type === 'number' || type === 'string') {
				media = { span: media };
			}
			let style = {},
				gutter = this.gutterIn,
				grid = this.gridIn,
				span = media.span || this.span,
				offset = media.offset || this.offset,
				push = media.push || this.push,
				pull = media.pull || this.pull;
			if (span) {
				style.width = (span / grid * 100).toFixed(2) + '%';
			}
			if (offset) {
				style.marginLeft = (offset / grid * 100).toFixed(2) + '%';
			}
			if (push) {
				style.left = (push / grid * 100).toFixed(2) + '%';
				style.position = 'relative';
			}
			if (pull) {
				style.right = (pull / grid * 100).toFixed(2) + '%';
				style.position = 'relative';
			}
			if (gutter !== 0) {
				style.paddingLeft = style.paddingRight = gutter / 2 + 'px'
			}
			return style;
		},
		media() {
			const width = this.width, xs = this.xs, sm = this.sm, md = this.md, lg = this.lg;
			let media = null;
			switch (true) {
				case !!(width <= 768 && xs): media = 'xs'; break;
				case !!(width >= 1200 && lg): media = 'lg'; break;
				case !!(width >= 992 && md): media = 'md'; break;
				case !!(width >= 768 && sm): media = 'sm'; break;
				default: media = 'md';
			};
			return media;
		},
		gridIn() {
			return this.grid || this.row.grid || 24;
		},
		gutterIn() {
			return this.gutter || this.row.gutter || 0;
		}
	},
	methods: {
		// getClientSize() {
		// 	const size = getClientSize('viewport');
		// 	this.width = size.width;
		// },
	},
	beforeDestroy() {
		EventListener.off(window, 'resize', this.getClientSize);
	}
};
</script>
