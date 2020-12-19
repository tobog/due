
<style lang="scss">
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (DatePicker 日期选择器)</h2>
			<h4 class="padding-top-10">选择或输入日期，支持年、月、日期等类型，支持选择范围。</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="8" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vDatepicker :options="{shortcuts:this.shortcuts}" v-model="value" v-bind="formData"></vDatepicker>
			</section>
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
			value: "",
			shortcuts: [
				{
					text: "Today",
					value() {
						return new Date();
					},
				},

				{
					text: "One week",
					value() {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
						return date;
					}
				}
			]
		};
	},
	computed: {
		getCode() {
			return `<vDatepicker v-model="value" v-bind="${this.getCodeString(
				this.formData
			)}">
					</vDatepicker>`;
		},
		getBase() {
			return [
				{
					label: "多个日期",
					key: "multiple",
					tag: "vSwitch",
					default: false
				},
				{
					label: "确认关闭",
					key: "confirm",
					tag: "vSwitch",
					default: true
				},
				{
					label: "仅读",
					key: "readonly",
					tag: "vSwitch",
					default: false
				},
				{
					label: "可清楚",
					key: "clearable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "显示星期数",
					key: "showWeek",
					tag: "vSwitch",
					default: true
				},
				{
					label: "展示的日期格式",
					key: "format",
					tag: "vInput",
					default: ""
				},
				{
					label: "显示类型",
					key: "type",
					tag: "vSelect",
					default: "datetime",
					options: [
						"date",
						"daterange",
						"datetime",
						"datetimerange",
						"year",
						"month",
						"times",
						"timesrange",
						"hours",
						"hoursrange"
					]
				}
			];
		},
		compProps() {
			return [
				{
					explain: "可以使用 v-model 双向绑定数据",
					prop: "value",
					type: "Array, String, Date",
					default: ""
				},
				{
					prop: "multiple",
					explain: "开启后，可以选择多个日期",
					type: "Boolean",
					default: "fasle"
				},
				{
					prop: "type",
					explain:
						"显示类型，可选值为 date、daterange、datetime、datetimerange、year、month",
					type: Boolean,
					default: false
				},
				{
					prop: "format",
					explain: "展示的日期格式",
					type: "String",
					default: "-"
				},
				{
					prop: "confirm",
					explain: "手动确认关闭",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "showWeek",
					explain: "开启后，可以选择多个日期",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "startDate",
					explain: "默认开始日期",
					type: "[String, Date, Object, Number]",
					default: "Date.now()"
				},
				{
					prop: "options",
					explain: "选择器额外配置，比如不可选日期与快捷选项",
					type: "Object",
					default: "-"
				},
				{
					prop: "$attrs",
					explain: "继承input 属性",
					type: "String",
					default: ""
				},
				{
					prop: "invalid",
					explain: "当前日期不可用",
					type: "Function",
					default: "Boolean:(dateObje,type)=>{}"
				},

				{
					prop: "on-change/on-blur/on-foucs/on-clear",
					explain: "事件",
					type: "Function:this.model, news, event=>{}",
					default: "-"
				}
			];
		}
	}
};
</script>
