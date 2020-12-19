

<template>
	<section :class="wrapClasses" :data-vview-module="$options.name" v-show="show">
		<aside :style="handleStyle('first')">
			<slot name="first"></slot>
		</aside>
		<aside :style="handleStyle('last')" ref="last">
			<slot name="last"></slot>
		</aside>
		<slot name="trigger" :handleSplit="handleSplit" :value="curValue">
			<aside v-drag-move="handleSplit" :class="_tobogPrefix_+'-trigger'" :style="triggerStyle"></aside>
		</slot>
	</section>
</template>

<script>
import DragMove from '../../directives/drag-move';
import { getStyles } from '../../utils/dom';
export default {
	name: 'Split',
	directives: {
		DragMove,
	},
	props: {
		value: {
			type: Number,
			default: 50,
		},
		mode: {
			type: String,
			default: 'horizontal' //horizontal ,vertical
		},
		min: {
			type: [String, Number],
			default: 0
		},
		max: {
			type: [String, Number],
			default: 100
		}
	},
	data() {
		return {
			curValue: this.value,
			show: false,
			run: false,
		};
	},
	mounted() {
		this.show = true;
		this.handleOffset();
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				if (val > this.max) val = this.max;
				if (val < this.min) val = this.min;
				this.curValue = val;
			}
		},
		curValue(val) {
			this.$emit('input', val);
			this.$emit('on-change', val);
		}
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-run`]: this.run,
					[`${_tobogPrefix_}-vertical`]: this.isVertical,
				}
			]
		},
		isVertical() {
			return this.mode === 'vertical'
		},
		boxSize() {
			if (!this.show) return { height: 1, width: 1 }
			const curValue = this.curValue;
			console.dir(this.$el.lastElementChild)
			return {
				width: this.$el.clientWidth,
				height: this.$el.clientHeight
			}
			// return {
			// 	width: parseFloat(getStyle(this.$el, 'width')),
			// 	height: parseFloat(getStyle(this.$el, 'height'))
			// }
		},
		triggerStyle() {
			if (this.isVertical) {
				return {
					top: this.curValue + '%',
					bottom: 'initial'
				}
			} else {
				return {
					left: this.curValue + '%',
					right: 'initial'
				}
			}
		},
		triggerSize() {
			if (!this.show) return { height: 1, width: 1 };
			const styles=getStyles(this.$el.lastElementChild);
			return {
				width: parseFloat(styles.width),
				height: parseFloat(styles.height)
			}
		},
		triggerOffset() {
			if (!this.show) return 0;
			if (this.isVertical) {
				return this.triggerSize.height / this.boxSize.height * 100
			} else {
				return this.triggerSize.width / this.boxSize.width * 100
			}
		}
	},
	methods: {
		handleOffset() {
			const lastRef = this.$refs.last;
			if (this.isVertical) {
				lastRef.style.paddingTop = this.triggerSize.height + 'px'
			} else {
				lastRef.style.paddingLeft = this.triggerSize.width + 'px'
			}
		},
		handleStyle(type) {
			if (this.isVertical) {
				if (type === 'first') {
					return {
						bottom: 100 - this.curValue + '%'
					}
				} else {
					return {
						top: this.curValue + '%'
					}
				}
			} else {
				if (type === 'first') {
					return {
						right: 100 - this.curValue + '%'
					}
				} else {
					return {
						left: this.curValue + '%'
					}
				}
			}
		},
		handleSplit(axis) {
			const { relative, run } = axis,
				boxSize = this.boxSize;
			this.run = run;
			console.log(relative, run)
			if (!this.__startUp) {
				this.__startUp = true;
				this.$emit('on-move-start', axis);
			}
			if (!run) {
				this.__startUp = false;
				this.$emit('on-move-end', axis);
				return;
			}
			if (this.isVertical) {
				this.curValue += relative[1] * 100 / boxSize.height;
			} else {
				this.curValue += relative[0] * 100 / boxSize.width;
			}
			const max = Math.min(this.max - this.triggerOffset, 100),
				min = Math.max(this.min, 0);
			if (this.curValue > max) this.curValue = max;
			if (this.curValue < min) this.curValue = min;
			this.$emit('on-moving', axis);
		}
	}
};
</script>
