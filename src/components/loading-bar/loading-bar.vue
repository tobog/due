
<template>
    <transition name="fade" appear>
        <div :class="_tobogPrefix_" v-show="visible">
			<slot :percent="percent"><div :class="innerClasses" :style="styles"></div></slot>
        </div>
    </transition>
</template>
<script>
export default {
	name: "LoadingBar",
	props: {
		color: {
			type: String,
			// default: 'success'
		},
		failColor: {
			type: String,
			// default: 'error'
		},
		height: {
			type: Number,
			default: 2
		},
		// config: Object
	},
	data() {
		return {
			percent: 0,
			status: '',
			visible: true,
			...this.$attrs,
			// ...this.config
		};
	},
	computed: {
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-inner-error`]: this.status === 'error',
					[`${_tobogPrefix_}-inner-success`]: this.status === 'success',
				},
			];
		},
		styles() {
			let style = {
				width: `${this.percent}%`,
				height: `${this.height}px`
			};

			if (this.color && this.status === 'success') {
				style.backgroundColor = this.color;
			}

			if (this.failColor && this.status === 'error') {
				style.backgroundColor = this.failColor;
			}
			return style;
		}
	},
};
</script>
