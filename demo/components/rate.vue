<style lang="scss" scoped>
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Rate 评分)</h2>
			<h4 class="padding-top-10">对事物进行快速的评级操作，或对评价进行展示。</h4>
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
				<vRate v-bind="formData" v-model="value"></vRate>
				<vRate v-bind="formData" character="A" v-model="value"></vRate>
			</section>
			{{ value }}
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
			value: ""
		};
	},
	computed: {
		getCode() {
			return `<vRate v-bind="${this.getCodeString(this.formData)}" v-model="value"></vRate>
					<vRate v-bind="${this.getCodeString(this.formData)}" character="A" v-model="value"></vRate>`;
		},
		getBase() {
			return [
				{
					label: "半选",
					key: "half",
					tag: "vSwitch",
					default: false
				},
				{
					label: "禁用",
					key: "disabled",
					tag: "vSwitch",
					default: false
				},
				{
					label: "只读",
					key: "readonly",
					tag: "vSwitch",
					default: false
				},
				{
					label: "取消选择",
					key: "clearable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "提示文字",
					key: "showLabel",
					tag: "vSwitch",
					default: true
				},
				{
					label: "自定义字符",
					key: "character",
					tag: "vInput",
					default: ""
				},
				{
					label: "主题",
					key: "theme",
					tag: "vSelect",
					default: "",
					options: this.getThemes
				},
				{
					label: "总数",
					key: "count",
					tag: "vInputNumber",
					default: 5
				},
			];
		},
		compProps() {
			return [
				{
					prop: "name",
					explain: "表单name",
					type: " String",
					default: ""
				},
				{
					prop: "value",
					explain: "可以使用 v-model 双向绑定数据",
					type: " Number",
					default: "-"
				},
				{
					prop: "half",
					explain: "半选",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "readonly",
					explain: "只读",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "clearable",
					explain: "是否可以取消选择",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "showLabel",
					explain: "提示文字",
					type: "Boolean",
					default: "true"
				},
				{
					prop: "disabled",
					explain: "是否禁用当前项",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "character",
					explain: "自定义字符",
					type: "String",
					default: ""
				},
				{
					prop: "count",
					explain: "count",
					type: "Number",
					default: "5"
				},
				{
					explain:
						"主题颜色可选值为 gray、primary、dashed、text、info、success、warning、error",
					prop: "theme",
					type: "String",
					default: ""
				},
				{
					prop: "on-change",
					explain: "事件",
					type: "Function： (val)=>{}",
					default: "-"
				},
				{
					prop: "slot",
					explain: "自定义显示内容",
					type: "VNode",
					default: "-"
				},
				{
					prop: "slot:label",
					explain: "自定义label",
					type: "VNode",
					default: "-"
				}
			];
		}
	}
};
</script>
