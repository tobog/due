
<template>
	<transition>
		<div :class="classes" :data-vview-module="$options.name">
			<span v-if="isRange" :class="_tobogPrefix_+'-bar'" :style="getRightStyle">
				<Tooltip :gpu="gpu" :always="type==='right'" placement="top-center" :reference="$refs.right">
					<span
						ref="right"
						:class="_tobogPrefix_+'-icon'"
						@mouseover.stop="handleHover('right')"
						:style="handleIconStyle('right')"
					></span>
					<div slot="content">{{tipFormat(rightVal)}}</div>
				</Tooltip>
			</span>
			<span :class="_tobogPrefix_+'-bar '+ _tobogPrefix_+'-bar-left'" :style="getLeftStyle">
				<Tooltip :gpu="gpu" :always="type==='left'" placement="top-center" :reference="$refs.left">
					<span
						tabindex="0"
						ref="left"
						:class="_tobogPrefix_+'-icon'"
						@mouseover.stop="handleHover('left')"
						:style="handleIconStyle('left')"
					></span>
					<div slot="content">{{tipFormat(leftVal)}}</div>
				</Tooltip>
			</span>
			
			<input
				v-show="isRange&&type==='right'"
				:disabled="disabled"
				:class="_tobogPrefix_+'-input'"
				type="range"
				:step="step"
				:min="min"
				:max="max"
				v-model="rightVal"
				@mouseover.stop="handleHover('right')"
				@change="handleChange"
				@mouseout.stop="handleHover('')"
			>
			<input
				v-show="type==='left'"
				:disabled="disabled"
				:class="_tobogPrefix_+'-input'"
				type="range"
				:step="step"
				:min="min"
				:max="max"
				v-model="leftVal"
				@change="handleChange"
				@mouseover.stop="handleHover('left')"
				@mouseout.stop="handleHover('')"
			>
			<slot></slot>
			<input type="hidden" :value="values" :name="name">
			<template v-if="isRange">
				<span
					@mouseover.stop="handleHover('right')"
					:class="_tobogPrefix_+'-mask'"
					:style="{left:percent.right+'%',right:0,zIndex:type==='left'?60:''}"
				></span>
				<span
					@mouseover.stop="handleHover('left')"
					:class="_tobogPrefix_+'-mask'"
					:style="{right:(100-percent.left)+'%',zIndex:type==='right'?60:''}"
				></span>
			</template>
		</div>
	</transition>
</template>

<script>
import Tooltip from '../tooltip/index';

export default {
	name: 'Slider',
	components: { Tooltip },
	props: {
		name: [String, Number],
		value: {
			type: [Number, String, Array],
			default: 0,
		},
		min: {
			type: [Number, String],
			default: 0,
		},
		max: {
			type: [Number, String],
			default: 100,
		},
		step: {
			type: [Number, String],
			default: 1,
		},
		disabled: Boolean,
		tipFormat: {
			type: Function,
			default(val, type) {
				return val;
			},
		},
		gpu: Boolean,
	},
	data() {
		return {
			leftVal: 0,
			rightVal: 0,
			type: '',
			isRange: this.value instanceof Array,
			percent: {
				left: 0,
				right: 0,
			},
		};
	},
	computed: {
		getRightStyle() {
			return { width: this.percent.right + '%' }
		},
		getLeftStyle() {
			return { width: this.percent.left + '%' }
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_,
				type = this.type,
				disabled = this.disabled,
				isRange = this.isRange;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${type}`]: !!type,
					[`${_tobogPrefix_}-disabled`]: disabled,
					[`${_tobogPrefix_}-range`]: isRange,
				},
			];
		},
		values() {
			return this.isRange ? [this.leftVal, this.rightVal] : this.leftVal;
		}
	},
	methods: {
		handleChange(event) {
			this.$emit('on-change', this.values, event)
		},
		handleHover(type) {
			this.type = type;
		},
		handleIconStyle(type) {
			const style = {};
			let percent = this.percent[type] || 0;
			if (percent >= 100) {
				percent = 100;
				style.right = 0;
			} else if (percent <= 0) {
				style.right = 'initial';
				style.left = 0;
			} else if (percent <= 50) {
				style.right = 'initial';
				style.left = "100%";
			}

			if (this.type === type) {
				style.transform = "translateY(-50%) scale(1.5)"
				style.zIndex = 0
				if (this.leftVal === this.rightVal) style.zIndex = 100;
			}
			return style;
		},
		handlePercent(value = 0) {
			const min = parseFloat(this.min || 0),
				max = parseFloat(this.max || 0);
			return parseFloat((value - min) / (max - min) * 100);
		},

	},

	watch: {
		leftVal(val, old) {
			val = parseFloat(val || 0);
			this.percent.left = this.handlePercent(val);
			if (this.isRange) {
				if (val > this.rightVal) {
					this.rightVal = val;
				}
				this.$emit('input', [val, this.rightVal]);
			} else {
				this.$emit('input', val);
			}
		},
		rightVal(val, old) {
			val = parseFloat(val || 0);
			this.percent.right = this.handlePercent(val);
			if (this.isRange) {
				if (val < this.leftVal) {
					this.leftVal = val;
				}
				this.$emit('input', [this.leftVal, val]);
			} else {
				this.$emit('input', val);
			}
		},
		value: {
			deep: true,
			immediate: true,
			handler(val, old) {
				if (this.isRange) {
					this.leftVal = val[0] || 0;
					this.rightVal = val[1] || 0;
				} else {
					this.leftVal = val || 0;
				}
			},
		},
	},
};
</script>
