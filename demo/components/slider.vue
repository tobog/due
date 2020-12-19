


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
		<section class="example" v-if="attrs.show">
			<div style="padding:20px 0;">视图：</div>
			<vSlider v-model="val" v-bind="attrs"></vSlider>
			<div style="padding:20px 0;">{{val}}</div>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			val: [],
			count: 20,
			switchs: {
				show: true,
				disabled: false,
				gpu: true,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				name: 20,
				min: 0,
				max: 100,
				step: 1,
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
                sortable:true,
			},
			]
		},
		data() {
			return [{
				prop: "name",
				explain: "input name",
				type: "String",
				default: "-"
			},
			{
				prop: "value",
				explain: "指定选中项目的 value 值，可以使用 v-model 双向绑定数据。单选时只接受 String 或 Number，多选时只接受 Array",
				type: "String | Number | Array",
				default: '-'
			},
			{
				prop: "min",
				explain: "min",
				type: "Number, String",
				default: 0
			},
			{
				prop: "max",
				explain: "max",
				type: "Number, String",
				default: 100
			},
			{
				prop: "step",
				explain: "step",
				type: "Number, String",
				default: 1
			},
			{
				prop: "disabled",
				explain: "是否禁用",
				type: "Boolean",
				default: false
			},
			{
				prop: "tipFormat",
				explain: "tipFormat",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "gpu",
				explain: "gpu",
				type: "Boolean",
				default: "false"
			},

			{
				prop: "on-change",
				explain: "事件",
				type: "	Function:model=>{}",
				default: "-"
			},

			]
		}
	},
};
</script>

