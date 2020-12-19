<template>
	<component
		:is="getTag"
		:class="classes"
		v-bind="$attrs"
		v-on="$listeners"
		@click="handleClick"
		@focusout="handleClick"
		tabindex="-1"
	>
		<div v-if="type==='horizontal'" :style="headStyles" :class="[_tobogPrefix_+'-content']">
			<div :class="headClasses" v-if="showHead" :style="headStyles">
				<slot name="title">
					<p v-if="title">
						<Icons v-if="icon" :type="icon"></Icons>
						<span>{{title}}</span>
					</p>
				</slot>
			</div>
			<div :class="bodyClasses" :style="bodyStyles" :order="bodyOrder">
				<slot></slot>
			</div>
		</div>
		<template v-else>
			<div :class="headClasses" v-if="showHead" :style="headStyles">
				<slot name="title">
					<p v-if="title">
						<Icons v-if="icon" :type="icon"></Icons>
						<span>{{title}}</span>
					</p>
				</slot>
			</div>
			<div :class="bodyClasses" :style="bodyStyles" :order="bodyOrder">
				<slot></slot>
			</div>
		</template>
		<div :class="[_tobogPrefix_+'-extra']" v-if="$slots.extra" :style="extraStyles">
			<slot name="extra"></slot>
		</div>
	</component>
</template>
<script>

import Icons from '../icons/index';
import { unit } from '../../utils/tool';
export default {
	name: 'Card',
	inheritAttrs: false,
	components: { Icons },
	props: {
		divider: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: true
		},
		shadow: {
			type: Boolean,
			default: false
		},
		reverse: {
			type: Boolean,
			default: false
		},
		padding: {
			type: Number,
			default: 16
		},
		title: {
			type: String,
		},
		icon: {
			type: String,
		},
		type: {
			type: String,
			// default: 'flip'//flip,tile,horizontal,
		}
	},
	data() {
		return {
			extraOrder: 7,
			headOrder: 3,
			bodyOrder: 5,
			fliped: false
		};
	},
	mounted() {
		this.handleOrder();
	},
	computed: {
		showHead() {
			return this.title || this.$slots.title
		},
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-border`]: this.border && !this.shadow,
					[`${_tobogPrefix_}-shadow`]: this.shadow,
					[`${_tobogPrefix_}-${this.type}`]: !!this.type,
					[`${_tobogPrefix_}-fliped`]: this.fliped && this.type === 'flip',
					[`${_tobogPrefix_}-reverse`]: this.reverse,
				}
			];
		},
		headClasses() {
			const _tobogPrefix_ = this._tobogPrefix_
			return [
				`${_tobogPrefix_}-head`,
				{
					[`${_tobogPrefix_}-head-divider`]: this.divider
				}
			];
		},
		headStyles() {
			return this.headOrder != 3 ? {
				order: this.headOrder
			} : ''
		},
		extraStyles() {
			return this.extraOrder != 7 ? {
				order: this.extraOrder
			} : ''
		},
		bodyClasses() {
			const _tobogPrefix_ = this._tobogPrefix_
			return `${_tobogPrefix_}-body`;
		},

		bodyStyles() {
			const style = {};
			if (this.padding !== 16) {
				style.padding = unit(this.padding, 'px')
			}
			if (this.bodyOrder != 5) {
				style.order = this.bodyOrder
			}
			return style
		},
		// Point out if it should render as <a> tag
		getTag() {
			const { to, href, tag = 'div' } = this.$attrs;
			if (to) return this.$router ? 'router-link' : 'a';
			if (href) return 'a';
			return tag;
		},
	},
	methods: {
		handleOrder() {
			const type = this.type;
			if (type === 'tile') {
				this.extraOrder = 0;
			}
		},
		handleClick(e) {
			if (this.type !== 'flip') return;
			const type = e.type;
			if (e === 'focusout') {
				this.fliped = false;
				return;
			}
			this.fliped = !this.fliped
		}
	},

};
</script>
