

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
			<vSwitch v-bind="attrs" v-model="val">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<vSwitch v-model="val">
				<vIcon type="md-checkmark" slot="open"></vIcon>
				<vIcon type="md-close" slot="close"></vIcon>
			</vSwitch>
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

				strict: true,
				size: 30,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				size: 50,
				trueValue: true,
				falseValue: false,
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
			return [{
				prop: 'name',
				explain: 'input的name,用于隐藏域',
				type: 'String',
				default: '-',
			},
			{
				prop: 'value',
				explain: '指定当前是否选中，可以使用 v-model 双向绑定数据',
				type: 'Boolean',
				default: 'false',
			},
			{
				prop: 'disabled',
				explain: '禁用开关',
				type: 'Boolean',
				default: 'false',
			},
			{
				prop: 'trueValue',
				explain: '指定选中时的值',
				type: 'Any',
				default: 'true',
			},
			{
				prop: 'falseValue',
				explain: '指定没有选中时的值',
				type: 'Any',
				default: 'false',
			},
			{
				prop: 'strict',
				explain: '严格模式',
				type: 'Boolean',
				default: 'true',
			},
			{
				prop: 'slot:open',
				explain: '指定选中时文本',
				type: 'VNODE:slot',
				default: '-',
			},
			{
				prop: 'slot:close',
				explain: '指定没有选中时文本',
				type: 'VNODE:slot',
				default: '-',
			},
			{
				prop: 'on-change',
				explain: 'on-change',
				type: 'Function:val=>{}',
				default: '-',
			},

			]
		}
	},
};
</script>

