

<template>
	<section :class="wrapClasses" :data-vview-module="$options.name">
		<div :class="_tobogPrefix_+'-wrap'" :style="barWrapStyle">
			<div :class="_tobogPrefix_+'-inner'" ref="inner" :style="bgInnerStyle">
				<div :class="_tobogPrefix_+'-bar'" :style="bgBarStyle"></div>
				<div :style="slotStyle" v-if="hasSlotProgrees" :class="_tobogPrefix_+'-inner-progress'">
					<slot name="progress"></slot>
				</div>
			</div>
		</div>
		<footer v-if="!hidetip" :class="_tobogPrefix_+'-text'" ref="text" :style="{width:barWrapSize}">
			<slot>
				<Icons
					v-if="isFinish"
					:class="_tobogPrefix_+'-text-inner'"
					@click.native.stop="handleClickIcon"
					:type="statusIcon"
				/>
				<span v-else :class="_tobogPrefix_+'-text-inner'">{{ percent }}%</span>
			</slot>
		</footer>
	</section>
</template>

<script>
import Icons from '../icons/index';
// import { getStyle } from '../../utils/dom'
import { findComponentUpward } from '../../utils/findComponent'
export default {
	name: 'Progress',
	components: {
		Icons,
	},
	props: {
		vertical: Boolean,
		active: Boolean,
		hidetip: Boolean,
		surplus: Boolean,
		percent: {
			type: [Number, String],
			default: 0,
		},
		status: {
			// validator(value) {
			// 	return oneOf(value, ['default', 'error', 'success']);
			// },
			default: 'default',
		},
		strokeWidth: {
			type: [Number, String],
			default: 8,
		},

	},
	data() {
		return {
			currentStatus: this.status,
			ready: false,
			barWrapSize: '',
		};
	},
	created() {
		this.handleStatus();
	},
	mounted() {
		if (this.surplus) this.__parent = this.getTopParent();
		this.ready = true;
		this.getBarWrapSize();
	},
	computed: {
		barWrapStyle() {
			const size = this.barWrapSize;
			if (!size) return
			return {
				paddingRight: size,
				marginRight: '-' + size
			}
		},
		hasSlotProgrees() {
			return !!this.$slots.progress
		},
		getPercent() {
			let ratio = 1, __parent = this.__parent;
			if (!__parent || !this.ready) return this.percent
			if (this.vertical) {
				ratio = __parent.$refs.inner.offsetHeight / this.$refs.inner.offsetHeight
			} else {
				ratio = __parent.$refs.inner.offsetWidth / this.$refs.inner.offsetWidth
			}
			console.log(ratio)
			return this.percent * ratio;
		},
		getVertical() {
			if (this.__parent && this.ready) return this.__parent.vertical;
			return this.vertical;
		},
		isFinish() {
			return this.currentStatus == 'error' || this.currentStatus == 'success';
		},
		statusIcon() {
			switch (this.currentStatus) {
				case 'error':
					return 'close';
					break;
				case 'success':
					return 'checkmark';
					break;
			}
		},
		bgBarStyle() {
			return this.getVertical
				? {
					height: `${this.getPercent}%`,
					width: `${this.strokeWidth}px`,
				}
				: {
					width: `${this.getPercent}%`,
					height: `${this.strokeWidth}px`,
				};
		},
		bgInnerStyle() {
			return this.getVertical
				? {
					width: `${this.strokeWidth}px`,
				}
				: {
					height: `${this.strokeWidth}px`,
				};
		},
		slotStyle() {
			return this.getVertical
				? {
					bottom: `${this.getPercent}%`,
					height: `${100 - this.getPercent}%`,
					position: "absolute"
				}
				: {
					width: `${100 - this.getPercent}%`,
				};
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				`${_tobogPrefix_}-${this.currentStatus}`,
				{
					[`${_tobogPrefix_}-ready`]: this.ready,
					[`${_tobogPrefix_}-tip`]: !this.hidetip,
					[`${_tobogPrefix_}-vertical`]: this.getVertical,
					[`${_tobogPrefix_}-active`]: this.active,
				},
			];
		},
	},

	methods: {
		getBarWrapSize() {
			if (this.hidetip || this.getVertical) return;
			this.$nextTick(() => {
				const size = (this.$refs.text || {}).offsetWidth;
				if (size) this.barWrapSize = size + 24 + 'px';
			})
		},
		getTopParent(context) {
			const parent = findComponentUpward(context || this, 'Progress');
			if (parent) return this.getTopParent(parent);
			return context;
		},
		handleClickIcon(type) {
			this.$emit('on-click', this.currentStatus);
		},
		handleStatus(isDown) {
			if (isDown) {
				this.currentStatus = 'default';
				this.$emit('on-status-change', 'default');
			} else {
				if (parseInt(this.getPercent, 10) >= 100) {
					this.currentStatus = 'success';
					this.$emit('on-status-change', 'success');
				}
			}
		},
	},
	watch: {
		percent(val, oldVal) {
			if (val < oldVal) {
				this.handleStatus(true);
			} else {
				this.handleStatus();
			}
		},
		status(val) {
			this.currentStatus = val;
		},
	},
};
</script>
