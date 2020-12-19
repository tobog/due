
<template>
	<div :class="classes" :data-vue-module="$options.name">
		<span :class="tailPreClasses">
			<Icons v-if="showArrow"  type="ios-arrow-forward" :class="[_tobogPrefix_ + '-arrow-icon']"></Icons>
		</span>
		<aside v-if="$slots.pre && isVertical" :class="[_tobogPrefix_ + '-pre']">
			<slot name="pre"></slot>
		</aside>
		<div :class="[_tobogPrefix_ + '-content']">
			<span :class="[_tobogPrefix_ + '-icon']">
				<slot name="icon">
					<Icons v-if="iconType" :type="iconType" size="24"></Icons>
					<span v-else>{{ stepNumber }}</span>
				</slot>
			</span>
			<div :class="[_tobogPrefix_ + '-title']">
				<slot>{{ title }}</slot>
				<div v-if="descSlot" :class="_tobogPrefix_ + '-desc'">
					<slot name="desc">{{ desc }}</slot>
				</div>
			</div>
			<aside v-if="isVertical && $slots.next" :class="[_tobogPrefix_ + '-next']">
				<slot name="next"></slot>
			</aside>
			<aside v-if="!isVertical && $slots.next" :class="[_tobogPrefix_ + '-next']">
				<slot name="next"></slot>
			</aside>
		</div>
		<span :class="tailNextClasses">
			<Icons  v-if="showArrow"   type="ios-arrow-forward" :class="[_tobogPrefix_ + '-arrow-icon']"></Icons>
		</span>
		<aside v-if="!isVertical && $slots.pre" :class="[_tobogPrefix_ + '-pre']">
			<slot name="pre"></slot>
		</aside>
	</div>
</template>

<script>
import Icons from "../icons/index";
import Emitter from "../../utils/emitter";

export default {
	name: "Step",
	mixins: [Emitter],
	components: {
		Icons
	},
	props: {
		status: {
			// validator(value) {
			// 	// return oneOf(value, ['wait', 'process', 'finish', 'error']);
			// },
			default: "wait"
		},
		title: String,
		desc: String,
		value: String,
		icon: String,
	},
	data() {
		return {
			curStatus: this.status,
			total: 1,
			stepNumber: 1,
			direction: "horizontal",
			showArrow: false,
			parentValue: null,
		};
	},
	created() {
		this.handleDispatch("on-step-change");
		this.parentValue = this.__parentComponent__ && this.__parentComponent__.getValue;
		this.$on("on-flow-step", this.handleFlow);
	},
	computed: {
		isVertical() {
			return this.direction === "vertical";
		},
		descSlot() {
			return this.desc || this.$slots.desc;
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				`${_tobogPrefix_}-${this.curStatus}`,
				{
					[`${_tobogPrefix_}-horizontal`]: !this.isVertical,
					[`${_tobogPrefix_}-vertical`]: this.isVertical,
					[`${_tobogPrefix_}-with-desc`]: this.descSlot
				}
			];
		},
		tailPreClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-tail`,
				`${_tobogPrefix_}-pre-tail`,
				// `${_tobogPrefix_}-tail-arrow`,
			]
		},
		tailNextClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-tail`,
				`${_tobogPrefix_}-next-tail`,
				// `${_tobogPrefix_}-tail-arrow`,
			]
		},
		iconType() {
			let icon = "";
			if (this.icon) {
				icon = this.icon;
			} else if (this.curStatus == "finish") {
				icon = "ios-checkmark";
			} else if (this.curStatus == "error") {
				icon = "ios-close";
			}
			return icon;
		}
	},
	methods: {
		handleFlow(child) {
			this.handleDispatch(
				"on-step-flow",
				this.value || this.stepNumber,
				true
			);
		},
		handleDispatch(...args) {
			if (this.__parentComponent__) {
				this.__parentComponent__.$emit(...args);
			} else {
				this.__parentComponent__ = this.dispatch("Steps", ...args);
			}
		}
	},
	watch: {
		status(val) {
			this.curStatus = val;
		}
	},
	beforeDestroy() {
		this.handleDispatch("on-step-change");
	}
};
</script>
