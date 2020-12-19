
<template>
	<section :class="classes" :style="styles">
		<aside :class="_tobogPrefix_ + '-tail'"></aside>
		<aside :class="_tobogPrefix_ + '-icon'">
			<slot name="icon">
				<Icons v-if="iconType" :type="iconType" size="24"></Icons>
				<span v-else>{{stepNumber}}</span>
			</slot>
		</aside>
		<article :class="_tobogPrefix_ + '-title'" v-html="title"></article>
		<footer :class="_tobogPrefix_ + '-desc'" v-if="descSlot">
			<slot>{{ desc}}</slot>
		</footer>
	</section>
</template>

<script>
import Icons from '../icons/index';
import Emitter from '../../utils/emitter';
import { oneOf } from '../../utils/tool';

export default {
	name: 'Steps',
	mixins: [Emitter],
	components: {
		Icons,
	},
	props: {
		status: {
			validator(value) {
				return oneOf(value, ['wait', 'process', 'finish', 'error']);
			},
			default: 'wait',
		},
		title: {
			type: String,
			default: '',
		},
		desc: {
			type: String,
		},
		value: {
			type: String,
		},
		icon: {
			type: String,
		},
		next: {
			type: Boolean,
			default: false,
		},
		pre: {
			type: Boolean,
			default: false,
		},
		// direction: {
		//     validator(value) {
		//         return oneOf(value, ['horizontal', 'vertical']);
		//     },
		//     default: '',
		// },
	},
	data() {
		return {
			currentStatus: this.status,
			total: 1,
			stepNumber: 1,
			direction: 'horizontal'
		};
	},
	computed: {

		descSlot() {
			return this.desc || this.$slots.default
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [`clearfix ${_tobogPrefix_}-item ${_tobogPrefix_}-item-${this.currentStatus}`, {
				[`${_tobogPrefix_}-item-next`]: this.next,
				[`${_tobogPrefix_}-item-all`]: this.pre,
			}];
		},
		styles() {
			const size = `${1 / (this.total + 0.5) * 100}%`;
			return this.direction === 'horizontal' ? { width: size } : { height: '' };
		},
		iconType() {
			let icon = '';
			if (this.icon) {
				icon = this.icon;
			} else if (this.currentStatus == 'finish') {
				icon = 'ios-checkmark-empty';
			} else if (this.currentStatus == 'error') {
				icon = 'ios-close';
			}
			return icon;
		},
	},
	methods: {
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('Steps', ...arguments);
			}
		},
	},
	watch: {
		status(val) {
			this.currentStatus = val;
		},
	},
	mounted() {
		this.handleDispatch('on-step-change');
	},
	beforeDestroy() {
		this.handleDispatch('on-step-change');
	},
};
</script>
