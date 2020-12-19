
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Input 加载中)</h2>
			<h4 class="padding-top-10">基本表单组件，支持 input 和 textarea，并在原生控件基础上进行了功能扩展，可以组合使用。</h4>
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
				<vInputNumber class="margin-bottom-20" v-model="val"></vInputNumber>
				<vInputNumber v-bind="formData" :formatter="val => `${val}%`" v-model="val"></vInputNumber>
				<div>{{val}}</div>
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
			val: '',
		};
	},
	computed: {
		getCode() {
			return `<vInputNumber class="margin-bottom-20" v-model="val"></vInputNumber>
					<vInputNumber v-bind="${this.getCodeString(this.formData)}" :formatter="val => val%" v-model="val"></vInputNumber>`;
		},
		getBase() {
			return [
				{
					label: "只读",
					key: "readonly",
					tag: "vSwitch",
					default: false
				},
				{
					label: "滚动变化",
					key: "scroll",
					tag: "vSwitch",
					default: false
				},
				{
					label: "禁用状态",
					key: "disabled",
					tag: "vSwitch",
					default: false
				},
				{
					label: "清空按钮",
					key: "clearable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "小数点",
					key: "precision",
					tag: "vInputNumber",
					// default: ''
				},
				{
					label: "Math对象方法",
					key: "math",
					tag: "vInput",
					// default: "",
				},
				{
					label: "最大值",
					key: "max",
					tag: "vInputNumber",
					// default: ''
				},
				{
					label: "最小值",
					key: "min",
					tag: "vInputNumber",
					// default: ''
				},
				{
					label: "步伐",
					key: "step",
					tag: "vInputNumber",
					default: 1
				},
				{
					label: "基数倍率",
					key: "radix",
					tag: "vInputNumber",
					default: 1
				},
				{
					label: "头部图标",
					key: "prefix",
					tag: "vSelect",
					default: 'person',
					options: this.iconslist
				},
				{
					label: "尾部图标",
					key: "suffix",
					tag: "vSelect",
					default: 'person',
					options: this.iconslist
				},
				{
					label: "主题",
					key: "theme",
					tag: "vSelect",
					default: '',
					options: this.getThemes
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'name',
					explain: '表单name',
					type: 'String',
					default: '',
				},
				{
					explain: "滚动变化",
					prop: "scroll",
					tag: "String",
					default: false
				},
				{
					prop: 'value',
					explain: '绑定的值，可使用 v-model 双向绑定',
					type: 'String|Number|Array',
					default: '',
				},
				{
					prop: '$attrs',
					explain: '继承$attrs',
					type: 'object',
					default: '-',
				},
				{
					prop: 'disabled',
					explain: '是否禁用',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'readonly',
					explain: '只读',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'clearable',
					explain: '是否显示清空按钮',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'precision',
					explain: '小数点',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'math',
					explain: 'Math对象方法',
					type: 'string',
					default: '-',
				},
				{
					prop: 'max',
					explain: '最大值',
					type: 'Number',
					default: '-',
				},
				{
					explain: "最小值",
					prop: "min",
					type: "Number",
					default: '-',
				},
				{
					prop: 'step',
					explain: '每次改变的步伐，可以是小数',
					type: 'Number',
					default: 1,
				},
				{
					prop: 'radix',
					explain: '基数倍率',
					type: 'Number',
					default: 1,
				},
				{
					explain: "主题：button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
					prop: "theme",
					type: "String",
					default: '',
				},
				{
					prop: 'formatter',
					explain: '指定输入框展示值的格式',
					type: 'Function',
					default: "(resultRadix,val)=val",
				},
				{
					prop: 'prefix|slot:prefix',
					explain: '输入框头部图标',
					type: 'String|VNode',
					default: '-',
				},
				{
					prop: 'suffix|slot:suffix',
					explain: '输入框尾部图标',
					type: 'String|VNode',
					default: '-',
				},
				{
					prop: 'on-change',
					explain: '数据改变时触发事件',
					type: 'Function:(val,event)=>{}',
					default: '-',
				},
				{
					prop: 'on-focus',
					explain: '输入框聚焦时触发事件',
					type: 'Function:(val,event)=>{}',
					default: '-',
				},
				{
					prop: 'on-blur',
					explain: '输入框失去焦点时触事件',
					type: 'Function:(val,event)=>{}',
					default: '-',
				},
				{
					prop: 'on-clear',
					explain: '点击清除触发事件',
					type: 'Function',
					default: '-',
				},
			];
		}
	}
};
</script>
