<style lang="scss">
.demo-badge {
	width: 42px;
	height: 42px;
	background: #eee;
	border-radius: 6px;
	display: inline-block;
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Badge 徽标数)</h2>
			<h4 class="padding-top-10">主要用于通知未读数的角标，提醒用户点击。</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="10" span="24" class="demo-view">
			<div>
				<vSwitch v-model="show" class="margin-bottom-10">
					<span slot="open">开</span>
					<span slot="close">关</span>
				</vSwitch>
			</div>
			<vBadge v-if="show" v-bind="formData">
				<span slot="label">label</span>
			</vBadge>
			<vBadge v-if="show" v-bind="formData">
				<a href="#" class="demo-badge"></a>
			</vBadge>
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
	computed: {
		getCode() {
			return `<vBadge v-bind="${this.getCodeString(this.formData)}">
						<a href="#" class="demo-badge"></a>
					</vBadge>`
		},
		getBase() {
			return [
				{
					label: "显示的标签",
					key: "label",
					// default: 20
				},
				{
					label: "封顶的标签",
					key: "overLabel",
					default: 99
				},
				{
					label: "位置偏移",
					key: "offset",
					default: []
				},
				{
					label: "类型",
					key: "type",
					tag: "vSelect",
					default: "",
					options: [
						{
							value: "info",
							label: "info"
						},
						{
							value: "warning",
							label: "warning"
						},
						{
							value: "error",
							label: "error"
						},
						{
							value: "success",
							label: "success"
						},
						{
							value: "default",
							label: "default"
						},
						{
							value: "primary",
							label: "primary"
						}
					]
				},
				{
					label: "展示label",
					key: "showLabel",
					tag: "vSwitch",
					default: true,
				},
				{
					label: "动画",
					key: "progress",
					tag: "vSwitch",
					default: false,
				}
			];
		},
		compProps() {
			return [
				{
					prop: "label",
					explain: "显示的标签",
					type: "Number, String",
					default: "-"
				},
				{
					prop: "overLabel",
					explain: "overLabel",
					type: "Number",
					default: "99"
				},
				{
					prop: "offset",
					explain: "设置状态点的位置偏移，格式为 [x, y]",
					type: "Array",
					default: "-"
				},
				{
					prop: "type",
					explain: "使用预设的颜色，：success、primary、default、error、warning、info",
					type: "String",
					default: "-"
				},
				{
					prop: "progress",
					explain: "动画progress",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "showLabel",
					explain: "控制label 显示",
					type: "Boolean",
					default: true
				},
				{
					prop: "format",
					explain: "控制label格式",
					type: "Function",
					default: "(label, overLabel)=>string"
				},
				{
					prop: "slot:default",
					explain: "显示内容",
					type: "VNode",
					default: "-"
				},
				{
					prop: "slot:label",
					explain: "显示内容label",
					type: "VNode",
					default: "-"
				}
			];
		}
	},
};
</script>
