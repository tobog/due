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
			<vInput style="margin-bottom:20px" v-bind="attrs" v-model="val">
				<vInput :class="_tobogPrefix_ + '-search'" />
				<vOption value="primary"></vOption>
				<vOption value="ghost"></vOption>
				<vOption value="dashed"></vOption>
				<vOption value="text"></vOption>
				<vOption value="info"></vOption>
				<vOption value="success"></vOption>
				<vOption value="success"></vOption>
				<vOption value="success"></vOption>
				<vOption value="success"></vOption>
			</vInput>
			<vInput style="margin-bottom:20px" v-model="val" v-bind="attrs">
				<div slot="prepend">http://</div>
				<span slot="append">.com</span>
				<div slot="suffix">http://</div>
				<span slot="prefix">.com</span>
			</vInput>
			<vInput style="margin-bottom:20px" :value="val" v-bind="attrs">
				<span slot="prepend">httpss://</span>
				<span slot="append">.com</span>
			</vInput>
			<vInput style="margin-bottom:20px" v-model="val" v-bind="attrs">
				<span slot="prepend">http://</span>
				<vInput v-model="val" slot="append">
					<span slot="prepend">http://</span>
					<span slot="append">.com</span>
				</vInput>
			</vInput>
			<vInput style="margin-bottom:20px" type="number" v-bind="{min:10,max:100}"></vInput>
			<vInputNumber style="margin-bottom:20px" :max="100" :min="10" v-model="val1"></vInputNumber>
			<vTextarea style="margin-bottom:20px" v-model="val1"></vTextarea>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			val: '1215454',
			val1: '',
			switchs: {
				disabled: false,
				clearable: false,
				transfer: false,
				search: false,
				filterable: true,
				autoClose: false,
				multiple: false,
			},
			selects: {
				type: 'text'
			},
			options: {
				type: ['button',
					'checkbox',
					'color',
					'date',
					'datetime',
					'datetime-local',
					'month',
					'week',
					'time',
					'email',
					'file',
					'hidden',
					'image',
					'number',
					'password',
					'radio',
					'range',
					'reset',
					'search',
					'submit',
					'tel',
					'text',
					'url',
				]
			},
			inputs: {
				name: "name",
				prefix: "person",
				suffix: "person",
				rows: 4,
				cols: 28,
				dropStyle: "",
				inputStyle: ""
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
				prop: 'text',
				explain: '输入框类型，继承h5类型',
				type: 'String',
				default: 'text',
			},
			{
				prop: 'value',
				explain: '绑定的值，可使用 v-model 双向绑定',
				type: 'String|Number',
				default: '',
			},
			{
				prop: '$attrs',
				explain: '继承$attrs',
				type: 'object',
				default: '-',
			},
			{
				prop: 'clearable',
				explain: '是否显示清空按钮',
				type: 'Boolean',
				default: 'false',
			},
			{
				prop: 'prefix',
				explain: '输入框头部图标',
				type: 'String',
				default: '-',
			},
			{
				prop: 'suffix',
				explain: '输入框尾部图标',
				type: 'String',
				default: '-',
			},
			{
				prop: 'search',
				explain: '否显示为搜索型输入框',
				type: 'Boolean',
				default: 'false',
			},

			{
				prop: 'rows',
				explain: 'textarea的 h5属性',
				type: '-',
				default: '4',
			},
			{
				prop: 'cols',
				explain: 'textarea的 h5属性',
				type: '-',
				default: '28',
			},
			{
				prop: 'slot：prepend',
				explain: 'input 前缀',
				type: '-',
				default: '-',
			},
			{
				prop: 'slot：append',
				explain: 'input 后缀',
				type: '-',
				default: '-',
			},

			{
				prop: 'on-change',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},
			{
				prop: 'on-icon-click',
				explain: '图标事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},
			{
				prop: 'on-focus',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},
			{
				prop: 'on-blur',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},
			{
				prop: 'on-enter',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},
			{
				prop: 'on-visible-change',
				explain: 'Drop变化',
				type: 'Function:val=>{}',
				default: '-',
			},
			{
				prop: 'on-search',
				explain: '事件：search',
				type: 'Function:val=>{}',
				default: '-',
			},
			]
		}
	},
};
</script>
