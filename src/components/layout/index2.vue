<template>
	<div :class="wrapClasses" :data-vue-module="$options.name">
		<header v-if="$slots.header" :class="navClasses" :style="headerStyle" >
			<slot name="header"></slot>
		</header>
		<main :class="[_tobogPrefix_ + '-main']" :style="contentStyle">
			<div
				:class="sliderClasses"
				:style="sliderStyle"
				v-if="$slots.slider"
			>
				<slot name="slider"></slot>
			</div>
			<div :class="[_tobogPrefix_ + '-content']" v-if="$slots.default">
				<slot></slot>
			</div>
		</main>
		<div :class="[_tobogPrefix_ + '-footer']" v-if="$slots.footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Layout",
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
			insideMode:{
				type:Boolean,
				defaul:false
			}
		},
		data() {
			return {};
		},
		computed: {
			wrapClasses(){
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					_tobogPrefix_,
					{
						[`${_tobogPrefix_}-inside`]: !!this.insideMode
					}
				];
			},
			navClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					`${_tobogPrefix_}-header`,
					{
						[`${_tobogPrefix_}-header-fixed`]: !!this.fixHeader
					}
				];
			},
			sliderClasses() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					`${_tobogPrefix_}-slider`,
					{
						[`${_tobogPrefix_}-slider-fixed`]: !!this.fixSlider
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
			headerStyle() {
				const height = this.getHeaderHeight;
				const width = this.getSliderWidth;
				const style={};
				if(height!=64) style.height=height + "px";
				if(!this.fixHeader &&
						this.fixSlider &&
						this.$slots.slider &&
						width) style.paddingLeft=width + "px";
				if(this.fixHeader&&this.insideMode&&this.fixSlider &&
						this.$slots.slider &&
						width) style.left=width + "px";
				return style;
			},
			sliderStyle() {
				const width = this.getSliderWidth;
				const height = this.getHeaderHeight;
				const style={};
				if(width!=200) style.width=width + "px";
				if(this.fixHeader&&!this.insideMode && this.$slots.header && height) style.top=height + "px";
				return style;
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
