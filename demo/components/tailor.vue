
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Tailor 裁剪)</h2>
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
				<vTailor v-bind="formData" v-model="val"></vTailor>
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
			return `<vTextarea class="margin-bottom-20" v-bind="${this.getCodeString(this.formData)}" v-model="val"></vTextarea>`;
		},
		getBase() {
			return [
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
					label: "只读",
					key: "readonly",
					tag: "vSwitch",
					default: false
				},
				{
					label: "默认行数",
					key: "rows",
					tag: "vInputNumber",
					default: 4
				}, {
					label: "一行字符数",
					key: "cols",
					tag: "vInputNumber",
					default: 28
				},
				{
					label: "头部图标",
					key: "prefix",
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
					explain: "默认行数",
					prop: "rows",
					type: "Number",
					default: 4
				}, {
					explain: "一行字符数",
					prop: "cols",
					type: "Number",
					default: 28
				},
				{
					explain: "主题：button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
					prop: "theme",
					type: "String",
					default: '',
				},
				{
					prop: 'prefix|slot:prefix',
					explain: '输入框头部图标',
					type: 'String|VNode',
					default: '-',
				},
				{
					prop: 'slots:prepend',
					explain: '输入框外头部组件',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slots:append',
					explain: '输入框外尾部组件',
					type: 'VNode',
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
					prop: 'on-keydown',
					explain: '按下键盘时触事件',
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
					prop: 'on-enter',
					explain: '按下回车键时触发事件',
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
