

<template>
	<section :data-vue-module="$options.name" :class="[_tobogPrefix_]" :style="wrapStyle">
		<aside :class="topClasses">
			<slot name="loading">
				<Loading :loading="direction==-1" fix :closable="false"></Loading>
			</slot>
		</aside>
		<slot></slot>
		<aside :class="bottomClasses">
			<slot name="loading">
				<Loading :loading="direction==1" fix :closable="false"></Loading>
			</slot>
		</aside>
	</section>
</template>

<script>
import { ScrollLoad } from "../../utils/dom";
import { unit } from "../../utils/tool";
import Loading from "../loading/loading.vue";
export default {
	name: 'Scroll',
	components: {
		Loading
	},
	props: {
		height: {
			type: Number,
			default: 300
		},
		offset: {
			type: Number,
			default: 30
		},
		isReachTop: {
			type: Boolean,
			default: true
		},
		// performance: {
		// 	type: String,
		// 	default: 'none'//middle high
		// },
		onReachEdge: Function,
	},
	data() {
		return {
			direction: 0//0；无， 1 ： down;-1：up
		}
	},
	mounted() {
		this.setScrollLoad()
	},
	watch: {
		getOptions() {
			this.setScrollLoad();
		},
	},
	computed: {
		wrapStyle() {
			const height = this.height && unit(this.height, 'px');
			if (height) return { height };
		},
		topClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-loading`,
				{
					[`${_tobogPrefix_}-loading-active`]: this.direction == -1
				}
			]
		},
		bottomClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-loading`,
				{
					[`${_tobogPrefix_}-loading-active`]: this.direction == 1
				}
			]
		},
		getOptions() {
			return {
				isReachTop: this.isReachTop,
				offset: this.offset
			}
		},
	},
	methods: {
		setScrollLoad() {
			if (!this._isMounted || typeof this.onReachEdge !== 'function') return;
			this.$nextTick(() => {
				const ele = this.$el;
				if (!ele) return;
				if (this._scrollLoad) {
					this._scrollLoad.update(ele, this.getOptions);
				} else {
					this._scrollLoad = new ScrollLoad(ele, this.getOptions, this.handleCallback);
				}
			})
		},
		async handleCallback(direction) {
			direction = direction ? 1 : -1;
			this.direction = direction;
			await this.onReachEdge(direction);
			this.direction = 0;
		},
		beforeDestroy() {
			this._scrollLoad && this._scrollLoad.destroy();
		},
	},
};
</script>
