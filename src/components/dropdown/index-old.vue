<template>
	<section
		:class="classes"
		:data-vue-module="$options.name"
		@mouseenter="handleMouseenter"
		@mouseleave="handleMouseleave"
	>
		<div :class="[_tobogPrefix_ + '-ref']" ref="reference" @click="handleClick">
			<slot>
				<Button :class="[_tobogPrefix_+'-button']" v-if="innerLabel" icon="arrow-dropdown">{{innerLabel}}</Button>
			</slot>
		</div>
		<Drop
			v-show="show"
			ref="drop"
			:update="autoLabel&&innerLabel"
			:class="[_tobogPrefix_ + '-list']"
			:reference="$refs.reference"
			:transfer="transfer||!!_ancestor_"
			:placement="placement"
			@click.native="handleClose"
			@mouseenter.native="handleMouseenter"
			@mouseleave.native="handleMouseleave"
		>
			<slot name="list"></slot>
		</Drop>
	</section>
</template>

<script>
import mixin from './mixin';
import Button from '../button/index';
import {
	findComponentUpward
} from '../../utils/findComponent';
export default {
	name: 'Dropdown',
	mixins: [mixin],
	components: {
		Button,
	},
	props: {
		label: String,
		autoLabel: Boolean
	},
	data() {
		return {
			children: [],
			innerLabel: this.label,
		};
	},
	beforeCreate() {
		this._ancestor_ = findComponentUpward(this, 'Dropdown');
	},
	created() {
		this.$on('on-select', this.getSelected);
		this.$on('on-update-child', this.addChild);
		this.$on('on-remove-child', this.removeChild);
	},
	mounted() {
		this._ancestor_ && this._ancestor_.$emit('on-update-child', this);
	},
	watch: {
		show(val) {
			if (!val) {
				this.children.forEach(child => {
					child.show = false;
				});
			}
			this.$emit('on-visible-change', val);
		},
	},
	methods: {
		getSelected(...arg) {
			this.$emit('on-change', ...arg);
			if (this.autoLabel) this.innerLabel = arg[1] === void 0 ? arg[0] : arg[1];
		},
		addChild(child) {
			this.children.push(child);
		},
		removeChild(child) {
			const children = this.children,
				index = children.indexOf(child);
			if (index > -1) children.splice(index, 1);
		},
		handleClose() {
			if (this.trigger === 'custom') return;
			if (this._isChildTrigger) {
				return this._isChildTrigger = null;
			}
			this.close(true);
		},
	},
};
</script>
