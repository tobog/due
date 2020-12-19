
<template>
	<section :class="classes" :data-vue-module="$options.name" v-show="ready">
		<slot></slot>
	</section>
</template>
<script>
import { debounce, validVal } from "../../utils/tool";
import { findComponentUpward } from '../../utils/findComponent';
export default {
	name: "Steps",
	props: {
		startIndex: {
			type: Number,
			default: 0
		},
		value: {
			type: Number,
			// default: 0
		},
		status: {
			// validator(value) {
			// 	return  ['wait', 'process', 'finish', 'error']oneOf(value,);
			// },
			default: "process"
		},
		direction: {
			// validator(value) {
			// 	return oneOf(value, ['horizontal', 'vertical']);
			// },
			default: "horizontal"
		},
		slotType:String,//pre,next
		startOrigin: {
			type: Boolean,
			default: false
		},
		strict: Boolean,
		showArrow: Boolean,

	},
	beforeCreate() {
		this.__parentComponent__ = findComponentUpward(this, 'Step');
	},
	data() {
		return {
			ready: false,
			model: [],
		};
	},
	created() {
		this.updateChild = debounce(this.updateChildProps);
		this.$on("on-step-change", this.updateChildProps);
		this.$on("on-step-flow", this.updateChildStatus);
		// console.log(this,this.slotType,this._uid)
	},
	watch: {
		status() {
			const value = this.getCurVal;
			if (validVal(value)) {
				this.updateChildStatus(value);
			}
		},
		getValue() {
			this.updateChildProps();
			this.handleInitFlow();
		},
		showArrow() {
			this.updateChildProps();
		}
	},
	computed: {
		getValue() {
			return validVal(this.value) ? this.value : (this.__parentComponent__ && this.__parentComponent__.parentValue || 0)
		},
		getDirection() {
			return this.__parentComponent__ ? (this.__parentComponent__.isVertical ? 'horizontal' : 'vertical') : this.direction
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_,
				direction =
					this.getDirection === "vertical" ? "vertical" : "horizontal";
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${direction}`]: direction,
					[`${_tobogPrefix_}-origin`]: this.startOrigin,
					[`${_tobogPrefix_}-${this.slotType}`]: this.slotType==='pre'||this.slotType==='next',
				}
			];
		},
		getCurVal() {
			const data = this.getValue;
			const val = Array.isArray(data) ? data : [data];
			const strict = this.strict;
			return this.model.find(item => {
				return val.some((value) => {
					return strict ? value === item : item == value;
				})
			});
		}
	},
	methods: {
		handleInitFlow() {
			const value = this.getCurVal;
			if (validVal(value)) {
				this.updateChildStatus(value);
				if (!this.startOrigin)
					this.handleDispatch("on-flow-step", this);
			}
		},
		getCurValIndex(val) {
			return this.model.findIndex(item => {
				return val === item;
			});
		},
		updateChildStatus(val, isFlow) {
			const _index = this.getCurValIndex(val);
			if (isFlow === true) {
				if (this.__index__ - _index > 0) return;
				this.__index__ = _index;
				if (!this.startOrigin)
					this.handleDispatch("on-flow-step", this);
			}
			this.$children.forEach((child, index) => {
				if (_index - index > 0) {
					child.curStatus = "finish";
					return;
				}
				if (_index == index) {
					child.curStatus = isFlow ? "finish" : this.status;
					return;
				}
				child.curStatus = "wait";
			});
		},
		updateChildProps() {
			let children = this.$children;
			const total = children.length,
				startIndex = Number(this.startIndex || 0),
				direction = this.getDirection,
				showArrow = this.showArrow,
				parentValue = this.getValue,
				model = [];
			// direction=this.__parentComponent__?this.__parentComponent__.direction;//获取父级的方向来生成自己的claas，可以减少css 的复杂控制， 下次优化
			children.forEach((child, index) => {
				index = startIndex + index;
				const val = child.value !== void 0 ? child.value : index;
				child.parentValue = parentValue
				child.stepNumber = index;
				child.total = total;
				child.direction = direction;
				child.showArrow = showArrow;
				model.push(val);
			});
			this.model = model;
			this.$nextTick(() => {
				this.ready = true;
				this.$nextTick(() => {
					this.handleInitFlow();
				});
			});
		},
		handleDispatch(...args) {
			if (this.__parentComponent__) {
				this.__parentComponent__.$emit(...args);
			}
			// else {
			// 	this.__parentComponent__ = this.dispatch("Step", ...args);
			// }
		}
	}
};
</script>
