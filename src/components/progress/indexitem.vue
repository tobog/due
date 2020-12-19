

<template>
	<section :class="wrapClasses" :style="outerStyle" :data-vview-module="$options.name">
		<div :class="_tobogPrefix_+'-bar'" :style="innerStyle">
			<span :class="_tobogPrefix_+'-text'" v-if="!hidetip">
				<slot>{{ percent }}%</slot>
			</span>
		</div>
	</section>
</template>
<script>

export default {
	inheritAttrs: false,
	name: 'ProgressItem',
	props: {
		vertical: Boolean,
		active: Boolean,
		hidetip: Boolean,
		percent: {
			type: [Number, String],
			default: 0,
		},
		status: {
			default: 'default',
		},
		strokeWidth: {
			type: [Number, String],
			default: 10,
		},
	},
	data() {
		return {
			currentStatus: this.status,
			group: false,
		};
	},
	created() {
		this.handleStatus();
	},
	computed: {
		bgStyle() {
			console.log(this.group)
			return this.vertical
				? {
					height: `${this.percent}%`,
					width: `${this.strokeWidth}px`,
					bottom: `${this.percentinner}%`,
				}
				: {
					width: `${this.percent}%`,
					height: `${this.strokeWidth}px`,
				};
		},
		innerStyle() {
			return this.group ? null : this.bgStyle
		},
		outerStyle() {
			return this.group ? this.bgStyle : { [this.vertical ? 'width' : 'height']: `${this.strokeWidth}px` }
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				`${_tobogPrefix_}-${this.currentStatus}`,
				{
					[`${_tobogPrefix_}-tip`]: !this.hidetip,
					[`${_tobogPrefix_}-vertical`]: this.vertical,
					[`${_tobogPrefix_}-active`]: this.active,
				},
			];
		},
	},
	methods: {
		handleStatus(isDown) {
			if (isDown) {
				this.currentStatus = 'default';
				this.$emit('on-status-change', 'default');
			} else {
				if (parseInt(this.percent, 10) >= 100) {
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
