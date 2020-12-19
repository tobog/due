<template>
	<main style="padding:20px 0;" class="examples-main clearfix">
		<vForm class="example" vertical>
			<div style="padding:10px 0;">参数：</div>
			<vFormItem v-for="(item,key) of switchs" :key="key" label-width="100" :label="key">
				<vSwitch v-model="switchs[key]" />
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
			<div style="padding:10px 0;">视图：</div>
			<vButton v-bind="attrs">vButton</vButton>
			<vButtonGroup v-bind="attrs" ref="vButtonGroup" style="padding-top:10px;">
				<vButton v-bind="attrs">vButton</vButton>
				<vButton v-bind="attrs">vButton</vButton>
			</vButtonGroup>
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
				vertical: false,
				compact: false,
				ghost: false,
				disabled: false,
				long: false,
			},
			selects: {
				theme: '',
				size: '',
				shape: '',
			},
			options: {
				theme: [
					'primary',
					'dashed',
					'text',
					'info',
					'success',
					'warning',
					'error',
					'default',
				],
				size: ['small', 'large', 'default'],
				shape: ['', 'circle'],
			},
		};
	},
	computed: {
		attrs() {
			return {
				...this.selects,
				...this.switchs,
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
				prop: 'theme',
				explain: 'button 颜色主题：primary,dashed,text,info,success,warning,error,default',
				type: 'String',
				default: 'default',
			},
			{
				prop: 'ghost',
				explain: '幽灵属性，使按钮背景透明',
				type: '	Boolean',
				default: 'false',
			},
			{
				prop: 'size',
				explain: '尺寸：small, large, default;//ButtonGroup组件通用',
				type: 'String',
				default: 'default',
			},
			{
				prop: 'icon',
				explain: '图标',
				type: 'String',
				default: '-',
			},

			{
				prop: 'slot',
				explain: '显示文本',
				type: 'VNODE:slot',
				default: '-',
			},

			{
				prop: 'compact',
				explain: 'ButtonGroup：是否紧密布局',
				type: 'Boolean',
				default: 'false',
			},

			{
				prop: 'vertical',
				explain: 'ButtonGroup：是否垂直布局',
				type: 'Boolean',
				default: 'false',
			},
			{
				prop: 'ButtonGroup:slot',
				explain: 'Button',
				type: 'VNODE:slot',
				default: '-',
			},

			{
				prop: '继承$attrs,$listeners',
				explain: 'Button：$attrs,$listeners',
				type: 'object',
				default: '-',
			},
			]
		}
	},

};
</script>
