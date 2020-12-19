<template>
	<div :class="wrapClasses" :data-vue-module="$options.name">
		<Header v-if="$slots.header" :fixed="fixHeader" :heigth="headerHeight">
			<slot name="header"></slot>
		</Header>
		<main :class="[_tobogPrefix_ + '-main']" :style="contentStyle">
			<Slider
				:fixed="fixSlider"
				:width="sliderWidth"
				v-if="$slots.slider"
			>
				<slot name="slider"></slot>
			</Slider>
			<div :class="[_tobogPrefix_ + '-content']" v-if="$slots.default">
				<slot></slot>
			</div>
		</main>
	</div>
</template>

<script>
	import Slider from "./slider";
	import Header from "./header";
	export default {
		name: "Layout",
		components: {
			Slider,
			Header
		},
		props: {
			fixHeader: {
				type: Boolean,
				default: false
			},
			headerHeight: {
				type: Number,
				default: 64
			},
			fixSlider: {
				type: Boolean,
				default: false
			},
			sliderWidth: {
				type: Number,
				default: 200
			},
			insideMode: {
				type: Boolean,
				defaul: false
			}
		},
		data() {
			return {};
		},
		computed: {
			wrapClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					_tobogPrefix_,
					{
						[`${_tobogPrefix_}-inside`]: !!this.insideMode
					}
				];
			},
			getHeaderHeight() {
				const height = parseFloat(this.headerHeight || 0);
				return isNaN(height) || !height ? 64 : height;
			},
			getSliderWidth() {
				const width = parseFloat(this.sliderWidth || 0);
				return isNaN(width) || !width ? 200 : width;
			},
			contentStyle() {
				const height = this.getHeaderHeight;
				const width = this.getSliderWidth;
				const style = {};
				if (this.fixHeader && this.$slots.header && height) {
					style.paddingTop = height + "px";
				}
				if (this.fixSlider && this.$slots.slider && width) {
					style.paddingLeft = width + "px";
				}
				return style;
			}
		}
	};
</script>
