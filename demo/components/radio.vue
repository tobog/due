<style lang="scss" scoped>
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Radio 单选框)</h2>
			<h4 class="padding-top-10">基本组件-单选框。主要用于一组可选项单项选择，或者单独用于切换到选中状态。</h4>
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
				<vRadio v-model="value" v-bind="formData" true-value="2">Radio</vRadio>
				<vRadio v-model="value" v-bind="formData" true-value="3">Radio1</vRadio>
				<vRadio v-model="value" v-bind="formData" true-value="5">Radio2</vRadio>
				<vRadio v-model="value" v-bind="formData" true-value="6" size="auto">
					<vButton slot="content" slot-scope="{isChecked}" :theme="isChecked?'primary':'default'">active</vButton>
				</vRadio>
			</section>
			{{value}}
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
			value: '',
		};
	},
	computed: {
		getCode() {
			return `<vRadio v-model="value" v-bind="${this.getCodeString(this.formData)}" true-value="2">Radio</vRadio>
					<vRadio v-model="value" v-bind="${this.getCodeString(this.formData)}" true-value="3">Radio1</vRadio>
					<vRadio v-model="value" v-bind="${this.getCodeString(this.formData)}" true-value="5">Radio2</vRadio>
					<vRadio v-model="value" v-bind="${this.getCodeString(this.formData)}" true-value="6" size="auto">
						<vButton slot="content" slot-scope="{isChecked}" :theme="isChecked?'primary':'default'">active</vButton>
					</vRadio>`;
		},
		getBase() {
			return [
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
					label: "严格相等",
					key: "strict",
					tag: "vSwitch",
					default: false
				},
				{
					label: "尺寸",
					key: "size",
					tag: "vInput",
					default: '',
				},
				{
					label: "主题",
					key: "theme",
					tag: "vSelect",
					default: '',
					options: this.getThemes
				},
				{
					label: "标签",
					key: "label",
					tag: "vTextarea",
					default: ''
				},
			];
		},
		compProps() {
			return [{
				prop: "value",
				explain: "可以使用 v-model 双向绑定数据",
				type: "String, Number, Boolean",
				default: "false"
			},
			{
				prop: "trueValue",
				explain: "选中时的值",
				type: "String, Number, Boolean",
				default: "true"
			},
			{
				prop: "falseValue",
				explain: "没有选中时的值，",
				type: "String, Number, Boolean",
				default: "-"
			},
			{
				prop: "name",
				explain: "表单name",
				type: "String",
				default: "-"
			},
			{
				prop: "label",
				explain: "指定当前选项的 value 值，组合会自动判断当前选择的项目",
				type: "String, Number",
				default: "-"
			},
			{
				prop: "disabled",
				explain: "是否禁用当前项",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "readonly",
				explain: "只读",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "strict",
				explain: "严格相等",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "size",
				explain: "单选框的尺寸，large、small、default，number,auto",
				type: "String, Number",
				default: "default"
			},
			{
				explain: "主题颜色可选值为 gray、primary、dashed、text、info、success、warning、error",
				prop: "theme",
				type: "String",
				default: "",
			},
			{
				prop: "on-change",
				explain: "事件",
				type: "Function： (val,event)=>{}",
				default: '-'
			},
			{
				prop: "slot：content",
				explain: "自定义显示状态内容",
				type: "VNode",
				default: "-"
			},
			{
				prop: "slot",
				explain: "自定义label",
				type: "VNode",
				default: "-"
			},
			]
		}
	}
};
</script>
