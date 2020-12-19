

<template>
	<section :class="wrapClasses" :data-vue-module="$options.name">
		<aside v-if="prepend" ref="prepend" :class="[_tobogPrefix_ + '-prepend']">
			<slot name="prepend"></slot>
		</aside>
		<div :class="innerClasses" data-form="textarea" tabindex="1" @focusin="handleFocus">
			<span v-if="showPrefix" :class="[_tobogPrefix_ + '-prefix']">
				<slot name="prefix">
					<Icons :type="prefix" center />
				</slot>
			</span>
			<textarea
				ref="input"
				v-model="model"
				:name="name"
				:class="_tobogPrefix_"
				:disabled="disabled"
				:readonly="readonly"
				@change="handleChange"
				@blur="handleBlur"
				@focus="handleFocus"
				@keydown="handleKeyCode"
				@paste="handleChange"
				:rows="rows"
				:cols="cols"
				v-bind="$attrs"
			/>
			<Icons
				v-if="isClearable"
				:class="clearClass"
				type="close"
				center
				@click.native.stop="handleClear"
			/>
		</div>
		<aside v-if="append" :class="[_tobogPrefix_ + '-append']">
			<slot name="append"></slot>
		</aside>
	</section>
</template>

<script>
import Icons from '../icons/index';
import mixin from './mixin';
export default {
	name: 'Textarea',
	inheritAttrs: false,
	mixins: [mixin],
	components: {
		Icons,
	},
	props: {
		value: String,
		rows: {
			type: Number,
			default: 4,
		},
		cols: {
			type: Number,
			default: 28,
		},
	},
	data() {
		return {
			model: this.value
		}
	},
	mounted() {
		this.handleDispatch('on-change', this.model);
	},
	methods: {
		handleClear() {
			this.model = '';
			this.$emit('on-clear');
		},
		handleChange(event) {
			this.$emit('on-change', this.model, event);
		},
		handleFocus(event) {
			this.isActive = true;
			if (this._isFocused) return;
			this._isFocused = false;
			this.$emit('on-focus', this.model, event);
		},
		handleKeyCode(event) {
			this.$emit('on-keydown', this.model, event);
			if (event.keyCode == 13) {
				this.$emit('on-enter', this.model, event);
			}
		},
		handleBlur(event) {
			this.isActive = this._isFocused = false;
			this.$emit('on-blur', this.model, event);
			this.handleDispatch('on-validate', this.model);
		},
	},
	watch: {
		value: {
			deep: true,
			handler(val, old) {
				this.model = val;
			},
		},
		model(val) {
			this.$emit('input', val);
			this.handleDispatch('on-change', val);
		},

	},

};
</script>
