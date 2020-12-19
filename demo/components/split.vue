
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
			<vSplit v-model="value" style="height:300px;border:1px solid #ddd" mode="vertical">
				<div slot="first" class="demo-split-pane">1
					<br>
				</div>
				<vSplit slot="last" mode="vertical">
					<vSplit v-model="value1" slot="first">
						<div slot="first" class="demo-split-pane">2
							<br>
						</div>
						<div slot="last" class="demo-split-pane">Right Pane</div>
					</vSplit>
					<div slot="last" class="demo-split-pane">3</div>
				</vSplit>
			</vSplit>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			value: 50,
			value1: 20,
			loading: false,
			switchs: {
				show: true,
				disabled: false,
				gpu: true,
			},
			selects: {
				mode: 'horizontal'
			},
			options: {
				mode: ['horizontal', 'vertical']
			},
			inputs: {
				min: 0,
				max: 100,
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
				sortable: true,
			},
			]
		},
		data() {
			return [
			{
				prop: "value",
				explain: "指定选中项目的 value 值，可以使用 v-model 双向绑定数据。单选时只接受 String 或 Number，多选时只接受 Array",
				type: "String | Number | Array",
				default: '-'
			},
			{
				prop: "mode",
				explain: "mode:'horizontal', 'vertical'",
				type: "String",
				default: 'horizontal'
			},
			{
				prop: "max",
				explain: "max",
				type: "Number, String",
				default: 100
			},
			{
				prop: "slot:first",
				explain: "slot",
				type: "VNode",
				default: '-'
			},
			{
				prop: "slot:last",
				explain: "slot",
				type: "VNode",
				default: '-'
			},
			{
				prop: "slot:trigger",
				explain: "slot",
				type: "VNode",
				default: '-'
			},
			{
				prop: "on-move-start/on-move-end/on-moving",
				explain: "事件",
				type: "	Function:axis=>{}",
				default: "-"
			},
			]
		}
	},
};
</script>


