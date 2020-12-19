
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Page 分页)</h2>
			<h4 class="padding-top-10">当数据量较多时，使用分页可以快速进行数据切换。</h4>
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
				<vPage v-bind="formData"></vPage>
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
			iconName: ''
		};
	},
	computed: {
		getCode() {
			return `<vPage v-bind="${this.getCodeString(this.formData)}"></vPage>`;
		},
		getBase() {
			return [
				{
					label: "显示总数",
					key: "showTotal",
					tag: "vSwitch",
					default: true
				},
				{
					label: "快速切换",
					key: "showElevator",
					tag: "vSwitch",
					default: true
				},
				{
					label: "显示分页",
					key: "showSizer",
					tag: "vSwitch",
					default: true
				},
				{
					label: "迷你版",
					key: "small",
					tag: "vSwitch",
					default: false
				},
				{
					label: "简洁版",
					key: "simple",
					tag: "vSwitch",
					default: false
				},
				{
					label: "置于body",
					key: "transfer",
					tag: "vSwitch",
					default: false
				},
				{
					label: "当前页码",
					key: "current",
					tag: "vInputNumber",
					default: 26
				},
				{
					label: "数据总数",
					key: "total",
					tag: "vInputNumber",
					default: 260
				},
				{
					label: "每页条数",
					key: "pageSize",
					tag: "vInputNumber",
					default: 10
				},
				{
					label: "显示条目数",
					key: "countPage",
					tag: "vInputNumber",
					default: 8
				},
				{
					label: "页数步距",
					key: "step",
					tag: "vInputNumber",
					default: 5
				},

			];
		},
		compProps() {
			return [
				{
					prop: "showTotal",
					explain: "显示总数",
					type: "Boolean",
					default: true
				},
				{
					prop: "showElevator",
					explain: "快速切换",
					type: "Boolean",
					default: true
				},
				{
					prop: "showSizer",
					explain: "显示分页",
					type: "Boolean",
					default: true
				},
				{
					prop: "small",
					explain: "迷你版",
					type: "Boolean",
					default: false
				},
				{
					prop: "simple",
					explain: "简洁版",
					type: "Boolean",
					default: false
				},
				{
					prop: "置于body",
					explain: "transfer",
					type: "Boolean",
					default: "true"
				},
				{
					prop: "step",
					explain: "页数步距",
					type: "Number",
					default: 5
				},
				{
					prop: "countPage",
					explain: "显示内容条目数",
					type: "Number",
					default: 8
				},
				{
					prop: "pageOpts",
					explain: "每页条数切换的配置",
					type: "Array",
					default: "[10, 50, 100, 500]"
				},

				{
					prop: "pageSize",
					explain: "每页条数",
					type: "Number",
					default: 10
				},
				{
					prop: "current",
					explain: "当前页码，支持 .sync 修饰符",
					type: "Number",
					default: 0
				},
				{
					prop: "total",
					explain: "数据总数",
					type: "Number",
					default: 0
				},
				{
					prop: "on-change",
					explain: "页码改变的回调，返回改变后的页码",
					type: "Function：Event",
					default: '(current,currentPageSize)=>{}'
				},
				{
					prop: "on-page-size-change",
					explain: "切换每页条数时的回调，返回切换后的每页条数",
					type: "Function:Event",
					default: '(currentPageSize)=>{}'
				},
				{
					prop: "slot:default",
					explain: "自定义显示总数",
					type: "VNode",
					default: '-'
				},
			];
		}
	}
};
</script>
