

<template>
	<main style="padding:20px 0;" class="examples-main clearfix">
		<vForm class="example" vertical>
			<div style="padding:10px 0;">参数：</div>
			<vFormItem v-for="(item,key) of switchs" :key="key" label-width="100" :label="key">
				<vSwitch v-model="switchs[key]"/>
			</vFormItem>
			<vFormItem v-for="(item,key) of selects" :key="key" label-width="100" :label="key">
				<vSelect v-model="selects[key]" transfer>
					<vOption v-for="(val,index) of options[key]" :value="val" :key="index"></vOption>
				</vSelect>
			</vFormItem>
			<vFormItem v-for="(item,key) of inputs" :key="key" label-width="100" :label="key">
				<vInput v-model="inputs[key]"></vInput>
			</vFormItem>
		</vForm>
		<section class="example">
			<vPage v-bind="attrs"></vPage>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			switchs: {
				showTotal: true,
				showElevator: true,
				showSizer: true,
				small: false,
				simple: false,
				transfer: true,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				current: 6,
				total: 100,
				pageSize: 10,
				countPage: 8,
				step: 5,
			},
		};
	},

	computed: {
		attrs() {
			return {
				...this.selects,
				...this.switchs,
				...this.inputs,
			}
		},
		columns() {
			return [{
				title: '属性/事件/方法',
				key: 'prop',
			},
			{
				title: '说明',
				key: 'explain',
				width: '50%'
			},
			{
				title: '类型',
				key: 'type',
			},
			{
				title: '默认值/参数/返回值',
				key: 'default',
			},
			]
		},
		data() {
			return [{
				prop: "transfer",
				explain: "在body下",
				type: "Boolean",
				default: "-"
			},
			{
				prop: "simple",
				explain: "简洁版",
				type: "Boolean",
				default: "-"
			},
			{
				prop: "small",
				explain: "small",
				type: "String",
				default: "-"
			},
			{
				prop: "showSizer",
				explain: "显示分页，用来改变page-size",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "showElevator",
				explain: "显示Input跳转",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "showTotal",
				explain: "showTotal",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "step",
				explain: "step",
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
				type: "Function：(current,currentPageSize)=>{}",
				default: 0
			},
			{
				prop: "on-page-size-change",
				explain: "切换每页条数时的回调，返回切换后的每页条数",
				type: "Function:(currentPageSize)=>{}",
				default: 0
			},

			]
		}
	},
};
</script>
