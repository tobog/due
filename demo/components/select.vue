
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Select 选择器&继承Input 组件所有属性)</h2>
			<h4 class="padding-top-10">
				<div>使用模拟的增强下拉选择器来代替浏览器原生的选择器。</div>
				<div>选择器支持单选、多选、搜索，以及键盘快捷操作。</div>
				<div>继承Input 组件除type和suffix的所有属性</div>
			</h4>
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
				<vSelect class="margin-bottom-20" v-bind="formData" v-model="val">
					<div slot="prepend">http://</div>
					<span slot="append">.com</span>
				</vSelect>
				<vSelect :options="options" class="margin-bottom-20" prefix v-bind="formData" v-model="val1"></vSelect>
				<vSelect class="margin-bottom-20" v-model="val2" v-bind="formData">
					<span slot="prepend">http://</span>
					<vSelect v-model="val4" slot="append" theme="primary"></vSelect>
				</vSelect>
				<div class="padding-15">{{val}}-{{val1}}-{{val2}}-{{val3}}</div>
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
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">Option组件：Props & Events</h2>
			<vTable :columns="getTableColumns" :data="compOptProps" class="demo-table" border stripe></vTable>
		</vCol>
	</vRow>
</template>


<script>
export default {
	// ${this.getCodeString(this.formData)}
	data() {
		return {
			val: '',
			val1: '',
			val2: '',
			val3: '',
			val4: '',
			options:null
		};
	},
	created(){
		var options = [];
		for (let index = 0; index < 100; index++) {
			options.push({
				value: index + 1,
				label: index,
			})
		}
		this.options=options;
	},
	computed: {
		getCode() {
			return `<vSelect class="margin-bottom-20" v-bind="${this.getCodeString(this.formData)}" v-model="val">
					<div slot="prepend">http://</div>
						<span slot="append">.com</span>
					</vSelect>
					<vSelect class="margin-bottom-20"  prefix  v-bind="${this.getCodeString(this.formData)}" v-model="val1">
						<vOption value="primary"></vOption>
						<vOption value="ghost"></vOption>
						<vOption value="dashed"></vOption>
						<vOption value="text"></vOption>
						<vOption value="info"></vOption>
						<vOption value="success"></vOption>
						<vOption value="success"></vOption>
					</vSelect>
					<vSelect class="margin-bottom-20" v-model="val2" v-bind="${this.getCodeString(this.formData)}">
						<span slot="prepend">http://</span>
						<vSelect v-model="val4" slot="append" theme="primary"></vSelect>
					</vSelect>`;
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
					label: "Drop置body下",
					key: "transfer",
					tag: "vSwitch",
					default: false
				},
				{
					label: "远程搜索",
					key: "search",
					tag: "vSwitch",
					default: false
				},
				{
					label: "过滤",
					key: "filterable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "自动关闭",
					key: "autoClose",
					tag: "vSwitch",
					default: false
				},
				{
					label: "多选",
					key: "multiple",
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
					label: "键盘操作",
					key: "keyModal",
					tag: "vSwitch",
					default: true
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
				{
					label: "无数据提示",
					key: "tip",
					tag: "vSelect",
					default: '暂无数据'
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'multipleKey',
					explain: '当mutiple=true下,渲染的取值key，type=file时默认multipleKey=name',
					type: 'String',
					default: '-',
				},
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
					prop: 'filterable',
					explain: '是否支持搜索',
					type: 'Boolean',
					default: 'true',
				},
				{
					prop: 'autoClose',
					explain: '非多选下自动关闭',
					type: 'Boolean',
					default: 'true',
				},
				{
					prop: 'multiple',
					explain: '是否支持多选',
					type: 'Boolean',
					default: 'true',
				},
				{
					explain: "主题：button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
					prop: "theme",
					type: "String",
					default: '',
				},
				{
					prop: 'dropStyle',
					explain: '给浮层添加额外的 Style 名称',
					type: 'Object, String',
					default: '',
				},
				{
					prop: 'tip',
					explain: '文字提示',
					type: 'String',
					default: '暂无数据',
				},
				{
					prop: 'keyModal',
					explain: '是否键盘操作',
					type: 'Boolean',
					default: 'true',
				},
				{
					prop: 'prefix|slot:prefix',
					explain: '输入框头部图标',
					type: 'String|VNode',
					default: '-',
				},
				{
					prop: 'search',
					explain: '否显示为搜索型输入框',
					type: 'Boolean',
					default: 'false',
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
					type: 'Function:(val,__attachData)=>{}',
					default: '-',
				},
				{
					prop: 'on-attach',
					explain: '数据改变时触发事件,获取附属数据',
					type: 'Function:(val,__attachData)=>{}',
					default: '-',
				},
				{
					prop: 'on-icon-click',
					explain: '点击图标时触发事件',
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
					prop: 'on-enter',
					explain: '按下回车键时触发事件',
					type: 'Function:(val,event)=>{}',
					default: '-',
				},
				{
					prop: 'on-visible-change',
					explain: 'Drop下拉变化触发事件',
					type: 'Function:val=>{}',
					default: '-',
				},
				{
					prop: 'on-search',
					explain: '点击搜索或按下回车键时触发事件：search',
					type: 'Function:val=>{}',
					default: '-',
				},
				{
					prop: 'on-remove-item',
					explain: '点击清空按钮时触发事件：search',
					type: 'Function:(val,index)=>{}',
					default: '-',
				},
				{
					prop: 'on-clear',
					explain: '点击清除触发事件',
					type: 'Function',
					default: '-',
				},
			];
		},
		compOptProps() {
			return [
				{
					prop: 'Option:value',
					explain: '绑定的value',
					type: 'String, Number',
					default: '-',
				},
				{
					prop: 'Option:label',
					explain: '显示的label',
					type: 'String, Number',
					default: '-',
				},
				{
					prop: 'Option:disabled',
					explain: '禁用',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'Option:strict',
					explain: '严格匹配value',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'Option:theme',
					explain: '主题，未定义继承触发Select Input的theme',
					type: 'String',
					default: '-',
				},
				{
					prop: 'Option:attach',
					explain: '附属数据，触发Select Input 的on-attach事件',
					type: 'Any',
					default: '-',
				},
				{
					prop: 'Option:slot:defalut',
					explain: '自定义显示',
					type: 'VNode',
					default: '-',
				}
			]
		},
	}
};
</script>
