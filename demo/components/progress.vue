
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
			<div style="padding:10px 0;">视图：</div>
			<vProgressGroup v-bind="attrs" :style="style">
				<vProgressItem v-bind="attrs"></vProgressItem>
				<vProgressItem v-bind="attrs"></vProgressItem>
				<vProgressItem v-bind="attrs"></vProgressItem>
			</vProgressGroup>
			<div style="padding:30px;display:inline-block;">:</div>
			<vProgressItem v-bind="attrs" :style="style"></vProgressItem>
			<div style="padding:30px;display:inline-block;">:</div>
			<vProgress v-bind="attrs" :style="style"></vProgress>
			<vProgress v-bind="attrs"  :style="style">
				<vProgress v-bind="attrs"  slot="progress">
					<vProgress v-bind="attrs"  slot="progress"></vProgress>
				</vProgress>
			</vProgress>
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
				show:true,
				hidetip: false,
				vertical: false,
				active: true,
				surplus:false,
				
			},
			selects: {
				status: 'default'
			},
			options: {
				status: ['default', 'error', 'success']
			},
			inputs: {
				percent: 20,
				speed: '10/3',
				strokeWidth: 6,
			},
		};
	},

	computed: {
		style() {
			return this.switchs.vertical ? 'height:300px;vertical-align:top;' : null
		},
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
				prop: "vertical",
				explain: "在body下",
				type: "Boolean",
				default: "-"
			},
			{
				prop: "surplus",
				explain: "Progress: 阶梯百分比",
				type: "Boolean",
				default: "-"
			},
			{
				prop: "percent",
				explain: "百分比",
				type: "Number",
				default: "-"
			},
			{
				prop: "status",
				explain: "状态，可选值为defaul、error、success",
				type: "String",
				default: "-"
			},
			{
				prop: "stroke-width",
				explain: "进度条的线宽，单位 px",
				type: "Number",
				default: "10"
			},
			{
				prop: "hidetip",
				explain: "隐藏数值或状态图标",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "vertical",
				explain: "是否在垂直方向显示",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "active",
				explain: "active",
				type: "Boolean",
				default: '-'
			},
			{
				prop: "vertical",
				explain: "ProgressGroup:属性",
				type: "Boolean",
				default: '-'
			},
			{
				prop: "strokeWidth",
				explain: "ProgressGroup:属性",
				type: "Number",
				default: 10
			},

			{
				prop: "on-status-change",
				explain: "事件",
				type: "Function：status",
				default: '-'
			},

			{
				prop: "slot:progress",
				explain: "Progress:自定义显示状态内容",
				type: "VNode",
				default: "-"
			},
			{
				prop: "slot",
				explain: "Progress,ProgressItem:自定义显示状态内容",
				type: "VNode",
				default: "-"
			},
			]
		}
	},
};
</script>

