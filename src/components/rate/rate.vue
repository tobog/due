
<template>
	<section
		:class="wrapClasses"
		:data-vview-module="$options.name"
		@mouseleave.stop="handleMouseleave"
	>
		<input type="hidden" :name="name" :value="current" />
		<span
			v-for="index in count"
			:key="index"
			:class="starCls(index)"
			@mousemove="handleMousemove(index, $event)"
			@click.stop="handleClick"
		>
			<slot>
				<template v-if="slotDefault">{{character}}</template>
				<template v-else>
					<Icons type="ios-star"></Icons>
					<Icons v-if="half" type="ios-star-half" :class="_tobogPrefix_ + '-star-half'" label="half"></Icons>
				</template>
			</slot>
		</span>
		<div :class="_tobogPrefix_ + '-text'" v-if="showText&&value>0">
			<slot name="label">{{ value }} {{langs('star','星')}}</slot>
		</div>
	</section>
</template>

<script>
import Emitter from '../../utils/emitter';
import Icons from '../icons/index';

export default {
	name: 'Rate',
	mixins: [Emitter],
	components: {
		Icons
	},
	props: {
		name: String,
		count: {
			type: Number,
			default: 5
		},
		value: {
			type: Number,
			default: 2.5
		},
		half: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		showText: {
			type: Boolean,
			default: true
		},
		clearable: {
			type: Boolean,
			default: false
		},
		character: String
	},
	data() {
		return {
			current: this.value
		};
	},
	computed: {
		isReadonly() {
			return this.disabled || this.readonly
		},
		slotDefault() {
			return this.$slots.default !== undefined || this.character !== undefined;
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-disabled`]: this.disabled,
					[`${_tobogPrefix_}-readonly`]: this.readonly
				}
			];
		}
	},
	watch: {
		value(val) {
			this.current = val;
		},
	},
	methods: {
		langs(key, defaultVal, val = {}) {
			if (typeof this.$t !== 'function') return defaultVal;
			key = `${this.__$langPrefix__}.rate.${key}`;
			key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
			const value = this.$t(key, val)
			return key === value ? defaultVal : value;
		},
		starCls(index) {
			const half = this.half, _tobogPrefix_ = this._tobogPrefix_,
				current = half ? this.current : Math.ceil(this.current);
			let active = false, isHalf = false;
			if (current >= index) active = true;
			if (half && current > index - 1 && current < index) isHalf = true;
			return [
				`${_tobogPrefix_}-star`,
				{
					[`${_tobogPrefix_}-star-active`]: active,
					[`${_tobogPrefix_}-star-half-active`]: isHalf || active,
				}
			];
		},
		handleMousemove(value, event) {
			if (this.isReadonly) return;
			if (this.half && event.target.getAttribute('label') === 'half') {
				value = value - 0.5;
			}
			this.current = value;
		},
		handleMouseleave() {
			if (this.isReadonly) return;
			this.current = this.value;
		},

		handleClick() {
			if (this.isReadonly) return;
			let value = this.current;
			if (this.clearable) value = 0;
			this.$emit('input', value);
			this.$emit('on-change', value);
		}
	}
};
</script>
