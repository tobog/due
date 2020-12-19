<template>
	<div :class="_tobogPrefix_">
		<button type="button" :class="arrowClasses" data-left @click="arrowEvent(-1)">
			<Icons type="ios-arrow-back"></Icons>
		</button>
		<button type="button" :class="arrowClasses" data-right @click="arrowEvent(1)">
			<Icons type="ios-arrow-forward"></Icons>
		</button>
		<div :class="[_tobogPrefix_ + '-list']">
			<div :class="[_tobogPrefix_ + '-item']" :style="itemStyles" ref="originTrack">
				<slot></slot>
				<div v-if="loop" ref="copyitem" :class="[_tobogPrefix_ + '-item']" :style="copyItemStyles"></div>
			</div>
		</div>

		<ul :class="dotsClasses">
			<template v-for="index in childrenList.length">
				<li
					:class="handleDotActive(index)"
					@click="dotsEvent('click', index - 1)"
					@mouseenter="dotsEvent('hover', index - 1)"
				>
					<button type="button" :data-radius="radiusDot"></button>
				</li>
			</template>
		</ul>
	</div>
</template>
<script>
import Icons from '../icons/index';
import { EventListener, getStyle } from '../../utils/dom';
export default {
	name: 'Carousel',
	components: { Icons },
	props: {
		arrow: {
			type: String,
			default: 'hover',
			// validator (value) {
			//     return oneOf(value, ['hover', 'always', 'never']);
			// }
		},
		reverse: {
			type: Boolean,
			default: false
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		speed: {
			type: Number,
			default: 3000
		},
		loop: {
			type: Boolean,
			default: true
		},
		easing: {
			type: String,
			default: 'ease'
		},
		dots: {
			type: String,
			default: 'inside',
			// validator (value) {
			//     return oneOf(value, ['inside', 'outside', 'none']);
			// }
		},
		radiusDot: {
			type: Boolean,
			default: false
		},
		trigger: {
			type: String,
			default: 'click',
			// validator (value) {
			//     return oneOf(value, ['click', 'hover']);
			// }
		},
		value: {
			type: Number,
			default: 0
		},
		// height: {
		// 	type: [String, Number],
		// 	default: 'auto',
		// 	// validator (value) {
		// 	//     return value === 'auto' || Object.prototype.toString.call(value) === '[object Number]';
		// 	// }
		// }
	},
	data() {
		return {
			childrenList: [],
			currentIndex: this.value,
			trackIndex: this.value,
			animation: true
		};
	},
	computed: {
		getItemSize() {
			let index = this.trackIndex;
			if (this.loop && index >= this.getLength - 1) {
				index = 0;
			}
			return (this.childrenList[index] || {}).getHeight;
		},
		itemStyles() {
			const length = this.getLength, width = length * 100,
				percent = this.getPercent * this.trackIndex, animation = this.animation;
			return {
				width: `${width}%`,
				height: this.getItemSize,
				transition: animation ? `transform 500ms ${this.easing}` : 'none',
				transform: `translate3d(-${percent}%, 0px, 0px)`,
			};
		},
		copyItemStyles() {
			return {
				width: this.getPercent + '%',
				height: (this.childrenList[0] || {}).getHeight,
			};
		},
		arrowClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-arrow`,
				`${_tobogPrefix_}-arrow-${this.arrow}`
			];
		},
		dotsClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-dots`,
				`${_tobogPrefix_}-dots-${this.dots}`
			];
		},
		getLength() {
			const length = this.childrenList.length || 0;
			if (this.loop) return length + 1;
			return length;
		},
		getPercent() {
			return 100 / this.getLength;
		}
	},
	methods: {
		initCopyDom() {
			if (!this.loop) return;
			this.$nextTick(() => {
				const length = this.getLength;
				if (length < 2) return;
				this.$refs.copyitem.innerHTML = this.childrenList[0].$el.innerHTML;
			});
		},
		// use when slot changed
		updateChildren() {
			this.$nextTick(() => {
				let index = 1;
				this.childrenList = [];
				this.$children.forEach((child) => {
					if (child.$options.name === 'CarouselItem') {
						child.index = index++;
						this.childrenList.push(child)
					}
				});
				const percent = this.getPercent + '%';
				this.childrenList.forEach((child) => {
					child.width = percent;
					// child.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
				});
			});
		},
		updateIndex(index) {
			this.trackIndex = index;
			this.currentIndex = (!this.loop && this.getLength - 1 <= index) ? 0 : index;
		},
		changeOffset(offset) {
			const length = this.getLength,
				loop = this.loop,
				oldIndex = this.trackIndex;
			let index = oldIndex + offset;
			if (loop && offset > 0 && index >= length) {
				this.animation = false;
				this.trackIndex = 0;
				index = 1;
			}
			if (loop && offset < 0 && index < 0) {
				this.animation = false;
				this.trackIndex = length - 1;
				index = length - 2;
			}
			if (!this.loop) index = index % length;
			setTimeout(() => {
				this.animation = true;
				this.updateIndex(index);
				this.$emit('on-change', oldIndex, this.currentIndex);
				this.$emit('input', this.currentIndex);
			}, 0);
		},
		arrowEvent(offset) {
			this.setAutoplay();
			this.changeOffset(offset);
		},
		dotsEvent(event, index) {
			let curIndex = this.trackIndex;
			if (event === this.trigger && curIndex !== index) {
				this.updateIndex(index);
				this.$emit('input', index);
				this.setAutoplay();
			}
		},
		setAutoplay() {
			clearTimeout(this.timer);
			if (this.autoplay) {
				const timeout = () => {
					this.timer = setTimeout(() => {
						this.changeOffset(this.reverse ? -1 : 1);
						timeout();
					}, this.speed)
				};
				timeout();
			}
		},
		handleDotActive(index) {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [{
				[`${_tobogPrefix_}-active`]: index - 1 === this.currentIndex
			}]
		},


	},
	watch: {
		autoplay() {
			this.setAutoplay();
		},
		speed() {
			this.setAutoplay();
		},
		value(val) {
			if (val == 0 && this.trackIndex == this.getLength - 1) return;
			this.updateIndex(val);
			this.setAutoplay();
		}
	},
	mounted() {
		this.setAutoplay();
	},
	beforeDestroy() {
		clearTimeout(this.timer);
	}
};
</script>
