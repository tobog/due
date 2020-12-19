

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
			<vRate v-bind="attrs" v-model="value"></vRate>
			<vRate v-bind="attrs" character="A"  v-model="value"></vRate>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			value:2,
			switchs: {
				show:true,
				disabled: true,
				strict: false,
			},
			selects: {
		
			},
			options: {
			
			},
			inputs: {
				label: 20,
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
				prop: "name",
				explain: "input name",
				type: "String",
				default: "-"
			},
			{
				prop: "count",
				explain: "star 总数",
				type: "Number",
				default: 5
			},
			{
				prop: "value",
				explain: "当前 star 数，可以使用 v-model 双向绑定数据",
				type: "Number",
				default: 2.5
			},
			{
				prop: "half",
				explain: "是否允许半选",
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
				prop: "showText",
				explain: "是否显示提示文字",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "clearable",
				explain: "是否可以取消选择",
				type: "Boolean",
				default: "-"
			},
			{
				prop: "character",
				explain: "自定义字符",
				type: "String",
				default: "-"
			},
			
			{
				prop: "on-change",
				explain: "事件",
				type: "Function： (val)=>{}",
				default: '-'
			},

			{
				prop: "slot",
				explain: "自定义显示状态内容",
				type: "VNode",
				default: "-"
			},
			{
				prop: "slot:label",
				explain: "自定义label",
				type: "VNode",
				default: "-"
			},
			]
		}
	},
};
</script>

