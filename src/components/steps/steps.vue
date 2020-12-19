
<template>
    <div :class="classes" :data-vview-module='$options.name' v-show="ready">
        <slot></slot>
    </div>
</template>
<script>
import { oneOf, debounce } from '../../utils/tool';
export default {
	name: 'Steps',
	props: {
		current: {
			type: Number,
			default: 0,
		},
		value: {
			type: Number,
			default: 0,
		},
		status: {
			validator(value) {
				return oneOf(value, ['wait', 'process', 'finish', 'error']);
			},
			default: 'process',
		},
		direction: {
			validator(value) {
				return oneOf(value, ['horizontal', 'vertical']);
			},
			default: 'horizontal',
		},
		order: {
			validator(value) {
				return oneOf(value, ['asc', 'desc']);
			},
			default: 'asc',
		}
	},
	data() {
		return {
			ready: false
		}
	},
	created() {
		this.updateChild = debounce(this.updateChildProps);
		this.$on('on-step-change', this.updateChild);
		this.$children = this.$children.reverse();
	},
	watch: {
		current() {
			this.updateChild();
		},
		status() {
			this.updateChild();
		},
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return `${_tobogPrefix_} ${_tobogPrefix_}-${this.direction}`;
		},

	},
	methods: {
		updateChildProps() {
			const children = this.order != 'desc' ? this.$children : this.$children.reverse(),
				total = children.length,
				current = this.current,
				direction = this.direction,
				status = this.status,
				value = this.value;
			children.forEach((child, index) => {
				index = value + index;
				child.stepNumber = index + 1;
				child.total = total;
				child.direction = direction;
				if (index < current) {
					child.currentStatus = 'finish';
				} else if (index == current) {
					child.currentStatus = status;
				} else {
					child.currentStatus = 'wait';
				}
			});
			this.$nextTick(()=>{
				this.ready=true;
			})
		},
	},

};
</script>
