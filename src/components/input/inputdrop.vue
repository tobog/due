

<template>
	<section :class="wrapClasses" :data-vue-module="dataVueModule">
		<aside v-if="prepend" :class="[_tobogPrefix_ + '-prepend']">
			<slot name="prepend"></slot>
		</aside>
		<template v-if="$slots.default">
			<slot></slot>
		</template>
		<div
			v-else
			ref="inputInner"
			data-form="input"
			tabindex="1"
			:class="innerClasses"
			@focusin="handleFocus"
			@click="toggleOpen"
		>
			<span v-if="showPrefix" :class="[_tobogPrefix_ + '-prefix']">
				<slot name="prefix">
					<Icons :type="prefix" center />
				</slot>
			</span>
			<div v-if="multiple" :class="[_tobogPrefix_ + '-tags']" @click.self="handleFileClick">
				<span :class="[_tobogPrefix_ + '-tag']" v-for="(val, index) in valueText" :key="index">
					{{ val }}
					<Icons
						v-if="!isReadonly"
						:class="[_tobogPrefix_ + '-tag-clear']"
						type="close"
						@click.native.stop="clearTag(index)"
					></Icons>
				</span>
				<input
					ref="input"
					:type="type"
					:name="isFile ? name : null"
					:class="inputClasses"
					:disabled="disabled"
					:multiple="multiple"
					:readonly="readonly || !isInput"
					@input="handleInput"
					@keydown="handleKeydown"
					@change="handleChange"
					@paste.stop.prevent="handleMultiPaste"
					v-bind="$attrs"
				/>
			</div>
			<input
				v-else
				ref="input"
				:value="valueText"
				:type="type"
				:name="isFile ? name : null"
				:class="inputClasses"
				:disabled="disabled"
				:multiple="multiple"
				:readonly="readonly || !isInput"
				@input="handleInput"
				@keydown="handleKeydown"
				@change="handleChange"
				@paste.stop.prevent="handleMultiPaste"
				v-bind="$attrs"
			/>
			<div
				v-if="isFile && !multiple"
				:class="[_tobogPrefix_ + '-tags']"
				@click.stop="handleFileClick"
			>{{ valueText }}</div>
			<Icons
				v-if="isClearable"
				:class="clearClass"
				type="close"
				center
				@click.native.stop="handleClear"
			/>
			<Icons v-if="isSelect" :class="[_tobogPrefix_ + '-arrow']" type="arrow-dropdown" center />
			<span
				v-if="!isSelect && showSuffix"
				:class="[_tobogPrefix_ + '-suffix']"
				@click.stop="handleIconClick"
			>
				<slot name="suffix">
					<Icons :type="suffix" center />
				</slot>
			</span>
		</div>
		<aside v-if="append" :class="[_tobogPrefix_ + '-append']">
			<slot name="append"></slot>
		</aside>
		<template v-if="showDrop">
			<Drop
				ref="drop"
				v-show="show"
				:transfer="transfer"
				:updateIndex="updateIndex"
				:class="[_tobogPrefix_ + '-drop']"
				:reference="getReference"
				:style="handleDropStyle"
				@scroll="handleScroll"
			>
				<slot name="drop"></slot>
			</Drop>
		</template>
	</section>
</template>
<script>
import { ClickOut } from "../../utils/dom";
import mixin from "./mixin";
import Drop from "../base/drop";
import Icons from "../icons/index";
import { throttle, validVal, debounce } from "../../utils/tool";
export default {
	name: "InputDrop",
	inheritAttrs: false,
	mixins: [mixin],
	components: {
		Drop,
		Icons
	},
	props: {
		dataVueModule: String,
		dropStyle: [Object, String],
		type: {
			type: String,
			default: "text"
		},
		isInput: {
			type: Boolean,
			default: true
		},
		transfer: Boolean,
		reference: HTMLElement,
		visible: Boolean,
		valueText: [String, Array],
		multiple: Boolean,
		isSelect: Boolean
	},
	data() {
		return {
			show: this.visible || false,
			updateIndex: 0,
			isActive: false
		};
	},
	mounted() {
		this.bindClickOut();
	},
	computed: {
		isFile() {
			return this.type === "file";
		},
		inputClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-file`]: this.isFile
				}
			];
		},
		showDrop() {
			return !!this.$slots.drop;
		},
		getReference() {
			if (this.reference instanceof HTMLElement) return this.reference;
			if (this.ready && this.$refs.inputInner)
				return this.$refs.inputInner;
			if (this.ready) return this.$el;
		},
		handleDropStyle() {
			const dropStyle = this.dropStyle || {},
				show = this.show,
				width = (this.getReference || {}).offsetWidth;
			return typeof dropStyle === "string"
				? `width:${width}px;${dropStyle}`
				: { width: `${width}px`, ...dropStyle };
		},
		iconClass() {
			return `${this._tobogPrefix_}-icon`;
		},
		isClearable() {
			return (
				!this.isReadonly &&
				this.clearable &&
				((Array.isArray(this.valueText) && this.valueText.length) ||
					validVal(this.valueText))
			);
		}
	},
	methods: {
		bindClickOut() {
			this.$nextTick(() => {
				const drop = (this.$refs.drop || {}).$el;
				const eles = drop ? [this.$el, drop] : this.$el;
				if (this._eleClickOut) {
					this._eleClickOut.update(eles);
					return;
				}
				this._eleClickOut = new ClickOut(
					eles,
					this.handleClickOut
				);
			});
		},
		handleClickOut(status, event) {
			if (status) {
				this.toggle(false);
				this.$emit("on-blur");
			}
		},
		toggle(status = false) {
			this.$nextTick(() => {
				this.show = status;
			});
		},
		close() {
			this.show = this.__isFocused = this.isActive = false;
			if (this.multiple && this.$refs.input) this.$refs.input.value = "";
		},
		toggleOpen() {
			if (this.isReadonly) return;
			this.show = !this.show;
			if (this.multiple) this.setInputFocus();
			this.isActive = true;
		},
		handleFocus(event) {
			this.isActive = true;
			if (this.__isFocused) return;
			this.__isFocused = true;
			this.$emit("on-focus", event);
		},
		setInputFocus() {
			if (!this.__isFocused || !this.$refs.input) return;
			this.isActive = true;
			this.$refs.input.focus();
		},
		handleInput(event) {
			if (
				this.isReadonly ||
				!this.isInput ||
				[13, 40, 27, 38].indexOf(event.keyCode) > -1
			)
				return;
			this.$emit("on-input", event);
		},
		handleKeydown(event) {
			if (this.isReadonly || !this.isActive) return;
			const keyCode = event.keyCode,
				show = this.show;
			if (!show && keyCode == 13 && this.showDrop) {
				this.show = true;
				return;
			}
			this.$emit("on-keydown", event);
		},
		handleChange(event) {
			this.$emit("on-change", event);
		},
		handleScroll(event) {
			this.$emit('on-scroll', event)
		},
		handleMultiPaste(event) {
			event = event || window.event;
			const data =
				event.clipboardData.getData("Text") ||
				window.clipboardData.getData("Text");
			event.target.value = data;
			this.handleInput(event);
		},
		handleClear() {
			this.$emit("on-clear");
		},
		clearTag(index) {
			this.$emit("on-remove-item", index);
		},
		updatedDrop() {
			this.$nextTick(() => {
				this.updateIndex += 1;
			});
		},
		handleIconClick(event) {
			this.$emit("on-icon-click", event);
		},
		getInputDom() {
			return this.$refs.input;
		},
		handleFileClick(event) {
			if (this.isFile) this.$refs.input.click();
		},
	},
	watch: {
		reference(val) {
			this.bindClickOut();
		},
		showDrop(val) {
			if (val !== old) this.bindClickOut();
		},
		show(val, old) {
			this.$emit("on-visible-change", val);
		},
		visible(val, old) {
			if (val === this.show) return;
			this.$nextTick(() => {
				this.show = val;
			});
		}
	},
	beforeDestroy() {
		this._eleClickOut && this._eleClickOut.destroy();
	}
};
</script>
