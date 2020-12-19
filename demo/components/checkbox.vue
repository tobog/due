
<style lang="scss">
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Checkbox 多选框)</h2>
			<h4 class="padding-top-10">基本组件-多选框。主要用于一组可选项多项选择，或者单独用于标记切换某种状态</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="10" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vCheckBox v-model="val1" true-value="3" v-bind="formData"></vCheckBox>
				<vCheckBox v-model="val" true-value="1" v-bind="formData"></vCheckBox>
				<vCheckBox v-model="val" true-value="2" v-bind="formData"></vCheckBox>
				<vCheckBox v-model="val" true-value="3" v-bind="formData"></vCheckBox>
				<vCheckBox v-model="val" :true-value="4" v-bind="formData"></vCheckBox>
			</section>
			<span class="padding-10 inline-block">val1:{{val1}}</span>
			<span class="padding-10 inline-block">val:{{val}}</span>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">Props & Events</h2>
			<vTable :columns="getTableColumns" :data="compProps" class="demo-table" border stripe></vTable>
		</vCol>
	</vRow>
</template>


<script>
export default {
	// ${this.getCodeString(this.formData)}
	data() {
		return {
			val1: '',
			val: []
		}
	},
	computed: {
		getCode() {
			return `<vCheckBox v-model="val1" true-value="0"
						 v-bind="${this.getCodeString(this.formData)}">
					</vCheckBox>
					<vCheckBox v-model="val" true-value="1"
						 v-bind="${this.getCodeString(this.formData)}">
					</vCheckBox>
					<vCheckBox v-model="val" true-value="2"
						 v-bind="${this.getCodeString(this.formData)}">
					</vCheckBox>
					<vCheckBox v-model="val" true-value="3"
						 v-bind="${this.getCodeString(this.formData)}">
					</vCheckBox>
					<vCheckBox v-model="val" true-value="4"
						 v-bind="${this.getCodeString(this.formData)}">
					</vCheckBox>
					`
		},
		getBase() {
			return [
				{
					label: "半选",
					key: "indeterminate",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "禁用",
					key: "disabled",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "仅读",
					key: "readonly",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "严格匹配",
					key: "strict",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "显示边框",
					key: "border",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "radio样式显示",
					key: "radio",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "反选",
					key: "reverse",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "label",
					key: "label",
					tag: "vInput",
					default: "label",
				},
				{
					label: "选中时的值",
					key: "trueValue",
					tag: "vInput",
					default: true,
				},
				{
					label: "循环",
					key: "falseValue",
					tag: "vInput",
					default: undefined,
				},
				{
					label: "多选框的尺寸",
					key: "size",
					tag: "vInput",
					default: "",
				},
				{
					label: "主题",
					key: "theme",
					tag: "vSelect",
					default: "",
					options: this.getThemes
				},
				{
					label: "图标",
					key: "trueIcon",
					tag: "vSelect",
					options: this.iconslist
				},

			];
		},
		compProps() {
			return [
				{
					explain: "表单名称",
					prop: "name",
					type: 'String',
					default: "-",
				},
				{
					explain: "可以使用 v-model 双向绑定数据",
					prop: "value",
					type: 'String, Number, Boolean, Array',
					default: "false",
				},
				{
					explain: "label",
					prop: "label",
					type: 'String',
					default: "-",
				},
				{
					explain: "选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用",
					prop: "trueValue",
					type: "String, Number, Boolean",
					default: true,
				},
				{
					explain: "没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用",
					prop: "falseValue",
					type: "String, Number, Boolean",
					default: undefined,
				},
				{
					explain: "设置 indeterminate 状态，只负责样式控制",
					prop: "indeterminate",
					type: "Boolean",
					default: false,
				},
				{
					explain: "是否禁用当前项",
					prop: "disabled",
					type: "Boolean",
					default: false,
				},
				{
					explain: "是否显示边框",
					prop: "border",
					type: "Boolean",
					default: false,
				},
				{
					explain: "是否仅读",
					prop: "readonly",
					type: "Boolean",
					default: false,
				},
				{
					explain: "是否严格匹配value",
					prop: "strict",
					type: "Boolean",
					default: false,
				},
				{
					explain: "是否radio样式显示",
					prop: "radio",
					type: "Boolean",
					default: false,
				},
				{
					explain: "是否反选",
					prop: "reverse",
					type: "Boolean",
					default: false,
				},
				{
					explain: "主题颜色可选值为 gray、primary、dashed、text、info、success、warning、error",
					prop: "theme",
					type: "String",
					default: "",
				},
				{
					prop: 'on-change',
					explain: '在选项状态发生改变时触发，通过修改外部的数据改变时不会触发',
					type: 'Function:Event',
					default: '(value, event)=>{}',
				},
				{
					explain: "多选框的尺寸",
					prop: "size",
					type: "String,Number",
					default: "",
				},
				{
					explain: "label 自定义",
					prop: "slot:default",
					type: "VNode",
					default: "",
				},
				{
					explain: "自定义 checkbox 样式",
					prop: "slot:content",
					type: "VNode：isChecked",
					default: "",
				},
			];
		}
	},
};
</script>
