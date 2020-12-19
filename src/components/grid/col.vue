
<template>
	<section v-bind="getProps" :data-vue-module="$options.name">
		<slot></slot>
	</section>
</template>
<script>

import { findComponentUpward } from '../../utils/findComponent';
export default {
	name: 'Col',
	props: {
		order: [Number, String],
		span: [Number, String],
		offset: [Number, String],
		push: [Number, String],
		gutter: [Number, String],
		pull: [Number, String],
		xs: [Number, String, Object],
		sm: [Number, String, Object],
		md: [Number, String, Object],
		lg: [Number, String, Object],
	},
	data() {
		return {
			row: {},
		};
	},
	created() {
		this.row = findComponentUpward(this, 'Row') || {};
	},
	computed: {
		getClasses() {
			const isValid = (val) => {
				return (!!val) || val === '0' || val === 0;
			},
				classes = [],
				prefix = this.__$cssPrefix__,
				list = ['order', 'span', 'offset', 'push', 'pull'],
				getMediaClass = function (obj) {
					list.forEach(function (key) {
						if (isValid(this[key])) {
							const _key = key === 'span' ? '' : `-${key}`,
								media = this._media_ ? `-${this._media_}` : '';
							classes.push(`${prefix}-col${media}${_key}-${this[key]}`);
						}
					}, obj)
				}
			this._media_ = "";
			getMediaClass(this);
			this.getMediaObj.forEach(getMediaClass);
			return classes
		},
		getMediaObj() {
			const transform = function (val, key) {
				const type = typeof val
				if (type === 'string' || type === 'number') return { span: val, "_media_": key };
				if (val && val instanceof Object) return { ...val, "_media_": key };
			}
			return ['xs', 'sm', 'md', 'lg'].map((key) => {
				return transform(this[key], key);
			}).filter(item => !!item);
		},
		getStyle() {
			const media = this.media,
				isValid = (val) => {
					return (!!val) || val == '0';
				},
				style = {},
				grid = this.gridIn
			let mediaObject = this[media],
				type = typeof mediaObject;
			if (type === 'number' || type === 'string') {
				mediaObject = { span: mediaObject };
			}
			if (!mediaObject) mediaObject = {};
			const order = isValid(mediaObject.order) ? mediaObject.order : this.order,
				span = isValid(mediaObject.span) ? mediaObject.span : this.span,
				offset = isValid(mediaObject.offset) ? mediaObject.offset : this.offset,
				push = isValid(mediaObject.push) ? mediaObject.push : this.push,
				pull = isValid(mediaObject.pull) ? mediaObject.pull : this.pull;
			if (isValid(span)) {
				style.width = (span / grid * 100).toFixed(2) + '%';
			}
			if (isValid(offset)) {
				style.marginLeft = (offset / grid * 100).toFixed(2) + '%';
			}
			if (isValid(push)) {
				style.left = (push / grid * 100).toFixed(2) + '%';
			}
			if (isValid(pull)) {
				style.right = (pull / grid * 100).toFixed(2) + '%';
			}
			if (isValid(order)) {
				style.order = order;
			}
			return style
		},
		getProps() {
			let gutter = this.gutterIn, style = {}, classes = [this._tobogPrefix_];
			if (this.isCustomeGrid) {
				style = this.getStyle;
			} else {
				classes.push(this.getClasses);
			}
			if (gutter && gutter != '0') {
				style.paddingLeft = style.paddingRight = gutter / 2 + 'px'
			}
			return { style, class: classes }
		},
		media() {
			const size = this.getSize, xs = this.xs, sm = this.sm, md = this.md, lg = this.lg;
			let media;
			switch (true) {
				case !!(size <= 768 && xs): media = 'xs'; break;
				case !!(size >= 1200 && lg): media = 'lg'; break;
				case !!(size >= 992 && md): media = 'md'; break;
				case !!(size >= 768 && sm): media = 'sm'; break;
			};
			return media;
		},
		getSize() {
			return this.row.size;
		},
		gridIn() {
			return parseInt(this.row.grid || 0) || 24;
		},
		gutterIn() {
			if (this.gutter !== undefined) return this.gutter;
			return this.row.gutter || 0;
		},
		isCustomeGrid() {
			return this.row.isCustomeGrid
		}
	},

};
</script>
