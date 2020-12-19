<template>
	<span :class="classes" :style="styles">
		<span
			v-if="$slots.default"
			ref="children"
			:class="[_tobogPrefix_ + '-slot']"
			:style="childrenStyle"
		>
			<slot></slot>
		</span>
		<Icons v-else :type="icon" :class="[_tobogPrefix_ + '-icon']"></Icons>
	</span>
</template>
<script>
import Icons from '../icons/index';
export default {
	name: 'Avatar',
	components: { Icons },
	props: {
		shape: {
			type: String,
			default: 'circle'//'circle', 'square'
		},
		size: {
			type: [String, Number],
			// default: '',
		},
		icon: {
			type: String,
			default: "ios-person"
		},
	},
	data() {
		return {
			scale: 1,
			childrenWidth: 0,
		};
	},
	computed: {
		isInnerSize() {
			return ['small', 'large', 'default'].indexOf(this.size) > -1;
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}`,
				`${_tobogPrefix_}-${this.shape}`,
				{
					[`${_tobogPrefix_}-${this.size}`]: this.isInnerSize && this.size
				}
			];
		},
		styles() {
			let style = {};
			if (this.size && !this.isInnerSize) {
				style.width = `${this.size}px`;
				style.height = `${this.size}px`;
				style.fontSize = `${this.size / 2}px`;
			}
			return style;
		},
		childrenStyle() {
			return {
				msTransform: `scale(${this.scale})`,
				WebkitTransform: `scale(${this.scale})`,
				transform: `scale(${this.scale})`,
			};
		}
	},
	methods: {
		setScale() {
			if (!this.$slots.default) return;
			if (this.$refs.children) {
				// set children width again to make slot centered
				this.childrenWidth = this.$refs.children.offsetWidth;
				const avatarWidth = this.$el.getBoundingClientRect().width;
				// add 4px gap for each side to get better performance
				if (avatarWidth - 8 < this.childrenWidth) {
					this.scale = (avatarWidth - 8) / this.childrenWidth;
				} else {
					this.scale = 1;
				}
			}
		},
		handleError(e) {
			this.$emit('on-error', e);
		}
	},
	mounted() {
		this.$nextTick(this.setScale);
	},
	updated() {
		this.setScale();
	}
};
</script>
