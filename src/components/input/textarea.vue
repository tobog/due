

<template>
	<section :class="wrapClasses" :data-vview-module="$options.name">
		<aside v-if="prepend" :class="_tobogPrefix_ + '-prepend'" :style="handlePendWidth('prepend')">
			<div ref="prepend" style="display:inline-block">
				<slot name="prepend"></slot>
			</div>
		</aside>
		<div :class="innerClasses" @mouseover="clearStatus=true" @mouseleave="clearStatus=false">
			<span v-if="showprefix" :class="iconWrapClass" data-type-icon="prefix" ref="prefix">
				<slot name="prefix">
					<Icons :type="prefix" :class="iconClass" center />
				</slot>
			</span>
			<span
				v-if="showsuffix"
				:class="iconWrapClass"
				@click.stop="handleIconClick"
				data-type-icon="suffix"
				ref="suffix"
			>
				<slot name="suffix">
					<Icons :type="suffix" center :class="iconClass" />
				</slot>
			</span>
			<Icons
				v-show="isClearable"
				:class="iconClasses"
				type="close"
				center
				@click.native.stop="handleClear"
			/>
			<textarea
				v-show="ready"
				ref="input"
				data-form="textarea"
				style="padding:10px;"
				v-model="model"
				:name="name"
				:class="_tobogPrefix_"
				:style="handleInputStyle()"
				:disabled="disabled"
				:readonly="readonly"
				@change="handleChange"
				@blur="handleBlur"
				@focus="handleFocus"
				@keydown.enter="handleKeyEnter"
				@paste="handleChange"
				:rows="rows"
				:cols="cols"
				v-bind="$attrs"
			/>
		</div>
		<aside v-if="append" :class="_tobogPrefix_ + '-append'" :style="handlePendWidth('append')">
			<div ref="append" style="display:inline-block">
				<slot name="append"></slot>
			</div>
		</aside>
	</section>
</template>

<script>
import Icons from '../icons/index';
import Emitter from '../../utils/emitter';
import mixin from './mixin'
export default {
	name: 'Textarea',
	inheritAttrs: false,
	mixins: [Emitter, mixin],
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
	methods: {
		handleClear() {
			this.model = '';
			this.$emit('on-clear');
		},
		handleChange(event) {
			this.$emit('on-change', this.model, event);
		},
		handleFocus(event) {
			this.$emit('on-focus', this.model, event);
		},
		handleKeyEnter(event) {
			this.$emit('on-enter', this.model, event);
		},
		handleBlur(event) {
			this.handleDispatch('on-validate', this.model);
			this.$emit('on-blur', this.model, event);
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
