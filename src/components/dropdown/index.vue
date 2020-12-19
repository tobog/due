<template>
	<section
		:class="_tobogPrefix_"
		:data-vview-module="$options.name"
		v-click-outside="{callback:handleClickOutside,reference}"
		@mouseenter.stop="handleMouseenter"
		@mouseleave.stop="handleMouseleave"
	>
		<div :class="_tobogPrefix_ + '-ref'" ref="reference" @click="handleClick">
			<slot></slot>
		</div>
		<Drop
			v-show="show"
			ref="drop"
			:class="_tobogPrefix_ + '-list'"
			:reference="$refs.reference"
			:transfer="transfer"
			:placement="placement"
			@click.native="handleClose"
			@mouseenter.native.stop="handleMouseenter"
			@mouseleave.native.stop="handleMouseleave"
		>
			<slot name="list"></slot>
		</Drop>
	</section>
</template>

<script>
import ClickOutside from '../../directives/click-outside';
import Drop from '../base/drop';
import {
	findComponentUpward
} from '../../utils/findComponent';
export default {
	name: 'Dropdown',
	directives: {
		ClickOutside,
	},
	components: {
		Drop,
	},
	props: {
		trigger: {
			validator(value) {
				return ['click', 'hover', 'custom'].indexOf(value) > -1;
			},
			default: 'click'
		},
		placement: {
			type: String,
			default: 'bottom'
		},
		visible: {
			type: Boolean,
			default: false
		},
		transfer: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			show: false,
			children: [],
		};
	},
	created() {
		this.$on('on-change', this.getSelected);
		this.$on('on-update-child', this.addChild);
		this.$on('on-remove-child', this.removeChild);
	},
	mounted() {
		if (this.ancestor) this.ancestor.$emit('on-update-child', this);
		this.$nextTick(()=>{
			this.show = this.visible || false;
		})
	},
	watch: {
		visible(val) {
			this.show = val;
		},
		show(val) {
			this.$emit('on-visible-change', val);
			if (!val) {
				this.children.forEach(child => {
					child.show = false;
				});
			}
		},
	},
	computed: {
		ancestor() {
			return findComponentUpward(this, 'Dropdown');
		},
		reference() {
			const show = this.show;
			return (this.$refs.drop || {}).$el
		}
	},
	methods: {
		getSelected(a, b, c, d) {
			this.$emit('on-click', a, b, c, d)
		},
		addChild(child) {
			this.children.push(child);
		},
		removeChild(child) {
			const children = this.children,
				index = children.indexOf(child);
			if (index > -1) children.splice(index, 1);
		},
		handleClickOutside(status) {
			if (status) this.show = false;
		},
		handleClick() {
			if (this.trigger !== 'click') return false;
			this.show = !this.show;
		},
		handleClose() {
			if (this.trigger === 'custom') return false;
			this.show = false;
		},
		handleMouseenter() {
			if (this.trigger !== 'hover') return false;
			const ancestor = this.ancestor;
			if (ancestor) clearTimeout(ancestor.__timeout);
			clearTimeout(this.__timeout);
			this.__timeout = setTimeout(() => {
				this.show = true;
			}, 300);
		},
		handleMouseleave() {
			if (this.trigger !== 'hover') return false;
			if (this.__timeout) {
				clearTimeout(this.__timeout);
				this.__timeout = setTimeout(() => {
					this.show = false;
				}, 200);
			}
		},
	},
	beforeDestroy() {
		if (this.ancestor) this.ancestor.$emit('on-remove-child', this);
		this.$off('on-update-child', this.addChild);
		this.$off('on-remove-child', this.removeChild);
		this.$off('on-change', this.getSelected);
		clearTimeout(this.__timeout);
		this.__timeout = null;
	},
};
</script>
