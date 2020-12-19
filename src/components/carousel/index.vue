<template>
	<section :class="wrapClasses" @mouseleave="playControl" @mouseenter="pause">
		<div :class="[_tobogPrefix_+'outer']">
			<div :class="[_tobogPrefix_ + '-list']" @mouseup="handelMouseup" @mousedown="handleMousedown">
				<slot></slot>
			</div>
		</div>
		<template v-if="arrow" v-once>
			<span :class="arrowClasses" data-left @click="play(false)" ref="arrowLeft">
				<Icons type="ios-arrow-back"></Icons>
			</span>
			<span :class="arrowClasses" data-right @click="play(true)" ref="arrowRight">
				<Icons type="ios-arrow-forward"></Icons>
			</span>
		</template>
		<aside v-if="dots&&childLen" :class="dotsClasses">
			<span
				v-for="index in childLen"
				:key="index"
				:class="[_tobogPrefix_ + '-dot']"
				:data-radius="radiusDot"
				@click="slide('click', index)"
				@mouseenter="slide('hover', index)"
			></span>
		</aside>
	</section>
</template>
<script>
import Icons from "../icons/index";
import Carousel from "../../utils/carousel";

export default {
	name: "Carousel",
	components: { Icons },
	props: {
		value: {
			type: Number,
			default: 0
		},
		reverse: {
			type: Boolean,
			default: false
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		loop: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 1000
		},
		arrow: {
			type: String,
			default: "always"
			// validator (value) {
			//     return oneOf(value, ['hover', 'always', 'never']);
			// }
		},
		dots: {
			type: String,
			default: "inside"
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
			default: "click"
			// validator (value) {
			//     return oneOf(value, ['click', 'hover']);
			// }
		},
		modal: {
			type: String,
			default: 'carousel',//carousel,fade
		},
		// slidesToShow: 3,
		// slidesToScroll: 3,
		// responsive: [
		// 	{
		// 		breakpoint: 1024,
		// 		settings: {
		// 			slidesToShow: 3,
		// 			slidesToScroll: 3,
		// 			infinite: true,
		// 			dots: true
		// 		}
		// 	},
		// ]
	},
	data() {
		return {
			childLen: 0,
			model: this.value,
		};
	},
	mounted() {
		this.init();
	},
	computed: {
		getConfig() {
			return {
				reverse: this.reverse,
				loop: this.loop,
				interval: this.interval,
				autoplay: this.autoplay,
				speed: this.speed,
				prefix: this._tobogPrefix_,
			};
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-fade`]: this.modal === 'fade',
				}
			];
		},
		arrowClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-arrow`,
				{
					[`${_tobogPrefix_}-arrow-${this.arrow}`]: !!this.arrow
				}
			];
		},
		dotsClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-dots`,
				`${_tobogPrefix_}-dots-${this.dots}`
			];
		}
	},

	methods: {
		init() {
			this.$nextTick(() => {
				this._Carousel = new Carousel(this.$el, this.getConfig, (that, index) => {
					const childLen = that._children.length,
						oldValue = this.model;
					if (childLen != this.childLen) this.childLen = childLen;
					if (index != oldValue) {
						this.model = index;
						this.$emit('input', index);
						this.$emit('on-change', index, oldValue);
					}
				});
				this._Carousel.slide(this.modal);
			});
		},
		play(isPre) {
			this._Carousel.step(isPre);
		},
		playControl() {
			this._Carousel.play();
		},
		pause() {
			this._Carousel.pause();
		},
		slide(event, index) {
			if (event === this.trigger) {
				this._Carousel.slide(index - 1);
			}
		},
		handelMouseup(e) {
			const xAxis = e.clientX - this._xAxis;
			console.log(xAxis)
			if (xAxis > 60) {
				this.play(true)
			}
			if (xAxis < -60) {
				this.play(false)
			}
			this._xAxis = 0;
		},
		handleMousedown(e) {
			this._xAxis = e.clientX
		},
		// use when slot changed
		updateConfig() {
			this.$nextTick(() => {
				this._Carousel && this._Carousel.update(this.getConfig);
			})
		}
	},
	watch: {
		getConfig() {
			this.updateConfig();
		},
		value(val) {
			if (val != this.model) {
				this.model = val;
				this._Carousel && this._Carousel.slide(val);
			}
		},
	},
	beforeDestroy() {
		this._Carousel && this._Carousel.destroy();
	}
};
</script>
