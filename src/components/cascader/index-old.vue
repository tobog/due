<template>
	<InputDrop
		dropStyle="width:auto;"
		:data-vue-module="$options.name"
		:class="wrapClasses"
		:visible="visible"
		:reference="$refs.inputInner"
		@on-blur="handleBlur"
	>
		<div
			:class="innerClasses"
			ref="inputInner"
			data-form="input"
			tabindex="1"
			@click="toggleOpen"
			@keydown.enter="handleEnter"
		>
			<input
				ref="input"
				type="text"
				:value="valueText"
				:class="[_tobogPrefix_ + '-input']"
				:disabled="disabled"
				:readonly="!filterable"
				@input="handleInput"
				@focus="handleFocus"
				v-bind="$attrs"
			/>
			<input type="hidden" v-if="name||name=='0'" :name="name" :value="model" />
			<Icons
				v-if="isClearable"
				:class="[_tobogPrefix_ + '-clearicon']"
				type="close"
				center
				size="1.1em"
				@click.native.stop="handleClear"
			/>
			<Icons
				v-if="!disabled"
				:class="[_tobogPrefix_ + '-arrow']"
				size="1.1em"
				type="arrow-dropdown"
				center
			/>
		</div>
		<div slot="drop" :class="[_tobogPrefix_ + '-list']" :transfer="transfer">
			<Caspanel
				index="0"
				:modelList="modelList"
				:data="getRootNodeList"
				:trigger="trigger"
				@on-select="select"
			></Caspanel>
			<Caspanel
				v-for="(value, index) in modelList"
				:modelList="modelList"
				:key="index"
				:index="index + 1"
				:data="getChildren(value.childIndexs)"
				:trigger="trigger"
				@on-select="select"
			></Caspanel>
		</div>
	</InputDrop>
</template>

<script>
import linkListMixin from "../../mixins/linkList";
import Caspanel from "./caspanel-item";
import Icons from "../icons/src/index";
import InputDrop from "../input/inputdrop-old";
import emitter from "../../utils/emitter";
export default {
	name: "Cascader",
	mixins: [linkListMixin, emitter],
	components: { Caspanel, InputDrop, Icons },
	props: {
		name: String,
		value: {
			type: Array,
			default() {
				return [];
			}
		},
		theme: String,
		trigger: {
			type: String,
			default: "click" //click,hover
		},
		transfer: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
		},
		filterable: {
			type: Boolean,
			default: true
		},
		prompt: {
			type: Boolean,
			default: true
		},
		autoClose: Boolean,
		renderFormat: Function,
		asyncData: Function
	},
	data() {
		return {
			model: [],
			modelList: [],
			visible: false,
			valueText: "",
			isActive: false
		};
	},
	created() {
		this.initData();
		this.initDefaultLabels();
		this.updateModel(this.value);
		this.handleDispatch("on-change", this.model);
	},
	computed: {
		innerClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-inner`,
				{
					[`${_tobogPrefix_}-active`]: this.visible || this.isActive,
					[`${_tobogPrefix_}-clear`]: this.isClearable
				}
			];
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-open`]: this.visible,
					[`${_tobogPrefix_}-disabled`]: this.disabled
				}
			];
		},
		setValueText() {
			if (typeof this.renderFormat === "function")
				return this.renderFormat(this.modelList);
			return this.modelList.map(item => item.data.label).join(" / ");
		},
		isClearable() {
			return (
				this.clearable && !this.disabled && this.valueText.length > 0
			);
		}
	},
	methods: {
		hasChildren(data) {
			return data.childIndexs && data.childIndexs.length > 0;
		},
		async select(data, index) {
			const hasChildren = this.hasChildren(data);
			this.modelList = this.modelList.slice(0, index);
			this.$set(this.modelList, index, data);
			if (!hasChildren && typeof this.asyncData === "function") {
				if (data.loading) return;
				this.$set(data, "loading", true);
				const result = await this.asyncData(data).catch(err => { });
				const children = result || data.children;
				this.$set(data, "loading", false);
				if (Array.isArray(children) && children.length > 0) {
					this.nodeList = this.asyncNodeList(children, data);
					this.modelList = [...this.modelList];
					return;
				}
			}
			if (!hasChildren) {
				this.updateModel(this.modelList.map(item => item.data.value));
				this.autoClose && this.handleBlur();
			}
		},
		handleEnter() {
			if (this.disabled || !this.visible) return;
			this.updateModel(this.modelList.map(item => item.data.value));
			this.handleBlur();
		},
		toggleOpen() {
			if (this.disabled) return;
			this.visible = !this.visible;
			this.isActive = true;
		},
		handleInput(event) {
			if (this.disabled || !this.filterable) return;
			const value = (this.valueText = event.target.value || "");
			if (!value) this.updateModel([]);
			const textList = value
				.replace(/\s+/g, "")
				.split("/")
				.filter(value => !!value);
			const modelList = [];
			textList.forEach(text => {
				const data = this.nodeList.find(item => {
					return item.data.label === text;
				});
				if (data) modelList.push(data);
			});
			this.modelList = modelList;
		},
		handleBlur() {
			if (!this.isActive) return;
			this.$nextTick(() => {
				this.initModelList();
				this.$emit("on-change", this.model);
				this.$emit("on-blur", this.model);
				this.close();
				this.$refs.input.blur();
			});
		},
		close() {
			this.visible = this._isFocused = this.isActive = false;
			this.handleDispatch("on-validate", this.model);
		},
		setInputFocus() {
			if (!this._isFocused || !this.filterable) return;
			this.$refs.input.focus();
		},
		handleFocus(event) {
			this.isActive = true;
			if (this._isFocused) return;
			this._isFocused = true;
			this.$nextTick(() => {
				this.$emit("on-focus", this.model, event);
			});
		},
		handleClear() {
			this.modelList = [];
			this.updateModel([]);
			this.setInputFocus();
			this.$emit("on-clear");
		},
		updateModel(val) {
			if (val === this.model) return;
			if (!val) val = [];
			if (val && !Array.isArray(val)) val = [val];
			this.model = val;
			this.initModelList();
			this.$emit("input", val);
			this.handleDispatch("on-change", val, this.modelList);
		},
		initModelList() {
			this.modelList = this.nodeList.filter(item => {
				const value = item.data.value;
				return this.model.some(val => val === value);
			});
			this.valueText = this.setValueText;
		},
		initDefaultLabels() {
			this.nodeList.forEach(node => {
				const data = node.data;
				if (data.label === void 0) data.label = data.value;
			});
		},
		handleDispatch(type, val) {
			if (this.__parentComponent__) {
				this.__parentComponent__.$emit(...arguments);
			} else {
				this.__parentComponent__ = this.dispatch(
					"FormItem",
					...arguments
				);
			}
		}
	},
	watch: {
		data: {
			deep: true,
			handler(val) {
				this.initData();
				this.initDefaultLabels();
				this.initModelList();
			}
		},
		value: {
			deep: true,
			handler(val, old) {
				this.updateModel(val);
			}
		},
		visible(val, old) {
			this.$emit("on-visible-change", val);
		}
	},
};
</script>