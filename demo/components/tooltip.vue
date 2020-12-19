
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
			<vTooltip v-bind="attrs">
				<vButton>vButton</vButton>
				<div slot="content">{{attrs}}</div>
			</vTooltip>
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
				transfer: true,
				disabled: false,
				gpu: false,
				always: undefined,
			},
			selects: {
				trigger: "hover",
				placement: "top-center",
				theme: 'dark'
			},
			options: {
				trigger: ['click', 'hover'],
				theme: ['dark', 'light'],
				placement: [
					'top-center',
					'top-left',
					'top-right',
					'bottom-center',
					'bottom-left',
					'bottom-right',
					'left-center',
					'left-top',
					'left-bottom',
					'right-center',
					'right-top',
					'right-bottom',
				]
			},
			inputs: {
				popperStyle: "",
				delay: 200,
				content: "",
				offset: 10,
				reference: "",

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
				prop: 'trigger',
				explain: 'trigger',
				type: 'String',
				default: '-',
			},
			{
				prop: 'transfer',
				explain: '弹层放置于 body 内',
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
				prop: 'content',
				explain: '显示的内容',
				type: 'Any',
				default: '-',
			},
			{
				prop: 'gpu',
				explain: 'gpu加速',
				type: 'Any',
				default: 'false',
			},
			{
				prop: 'always',
				explain: '是否总是可见',
				type: 'Boolean',
				default: '-',
			},
			{
				prop: 'popperStyle',
				explain: 'popper Style',
				type: 'String, Object',
				default: '-',
			},
			{
				prop: 'theme',
				explain: 'theme：//dark,light ',
				type: 'String',
				default: 'dark',
			},
			{
				prop: 'delay',
				explain: '延迟显示，单位毫秒',
				type: 'Number',
				default: '200',
			},
			{
				prop: 'offset',
				explain: '出现位置的偏移量',
				type: 'Number',
				default: '5',
			},
			{
				prop: 'placement',
				explain: 'left，right，top，bottom，center，组合',
				type: 'String',
				default: 'top-center',
			},
			{
				prop: 'reference',
				explain: 'reference 参照索引',
				type: 'HTMLElement',
				default: '-',
			},
			{
				prop: 'slot:content',
				explain: '指定内容',
				type: 'VNODE:slot',
				default: '-',
			},
			{
				prop: 'slot',
				explain: '',
				type: 'VNODE:slot',
				default: '-',
			},
			{
				prop: 'on-visible-change',
				explain: 'on-visible-change',
				type: 'Function:visible=>{}',
				default: '-',
			},

			]
		}
	},
};
</script>

