
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Tooltip 文字提示)</h2>
			<h4 class="padding-top-10">文字提示气泡框，在鼠标悬停时显示，代替了系统的title提示。</h4>
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
				<vTooltip v-bind="formData">
					<vButton>vButton</vButton>
					<div slot="content">{{formData}}</div>
				</vTooltip>
				<vTooltip v-bind="formData">
					<vButton>Long Content</vButton>
					<div slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</div>
				</vTooltip>
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
			return `
				<vTooltip v-bind="${this.getCodeString(this.formData)}">
					<vButton>vButton</vButton>
					<div slot="content">{{${this.getCodeString(this.formData)}}}</div>
				</vTooltip>
				<vTooltip v-bind="${this.getCodeString(this.formData)}">
					<vButton>Long Content</vButton>
					<div slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</div>
				</vTooltip>`;
		},
		getBase() {
			return [
				{
					label: "置于body下",
					key: "transfer",
					tag: "vSwitch",
					default: false
				},
				{
					label: "清空按钮",
					key: "disabled",
					tag: "vSwitch",
					default: false
				},
				{
					label: "gpu渲染",
					key: "gpu",
					tag: "vSwitch",
					default: false
				},
				{
					label: "总是可见",
					key: "always",
					tag: "vSwitch",
					// default:""
				}, {
					label: "偏移量",
					key: "offset",
					tag: "vInputNumber",
					default: 10,
				}, {
					label: "延迟显示",
					key: "delay",
					tag: "vInputNumber",
					default: 300,
				}, {
					label: "触发方式",
					key: "trigger",
					tag: "vSelect",
					default: "click",
					options: ['click', 'hover']
				},
				{
					label: "主题",
					key: "theme",
					tag: "vSelect",
					default: 'dark',
					options: ['dark', 'light', ...this.getThemes],
				},
				{
					label: "位置",
					key: "placement",
					tag: "vSelect",
					default: 'top-center',
					options: this.getPlacements
				}, {
					label: "显示的内容",
					key: "content",
					tag: "vTextarea",
					default: "显示的内容 test",
				}
			];
		},
		compProps() {
			return [
				{
					prop: 'trigger',
					explain: '触发方式click,hover',
					type: 'String',
					default: '',
				},
				{
					prop: 'gpu',
					explain: 'gpu css3渲染',
					type: 'Boolean',
					default: true,
				},
				{
					prop: 'transfer',
					explain: '是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果',
					type: 'Boolean',
					default: '',
				},
				{
					prop: 'disabled',
					explain: '是否禁用',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'content',
					explain: '显示的内容',
					type: 'String',
					default: 'false',
				},
				{
					prop: 'always',
					explain: '是否总是可见',
					type: 'Boolean',
					default: 'false',
				},
				{
					explain: "提示框 样式",
					prop: "popperStyle",
					type: "String|Object",
					default: "-"
				}, {
					explain: "提示框 class",
					prop: "popperClass",
					type: "String|Array",
					default: "-"
				},
				{
					explain: "主题：button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
					prop: "theme",
					type: "String",
					default: '',
				},
				{
					prop: 'offset',
					explain: '出现位置的偏移量',
					type: 'String',
					default: '5',
				},
				{
					prop: 'placement',
					explain: "提示框出现的位置，可选值为:'top','top-left','top-right','top-center','top-fix','bottom','bottom-left','bottom-right','bottom-center','bottom-fix','left','left-top','left-bottom','left-center','right','right-top','right-bottom','right-center','fix-left','fix-right','fix-center',",
					type: 'String',
					default: 'top-center',
				},
				{
					prop: 'reference',
					explain: '相对索引元素',
					type: "HTMLElement",
					default: '-',
				},
				{
					prop: 'delay',
					explain: '延迟显示，单位毫秒',
					type: "Number",
					default: '0',
				},
				{
					prop: 'slot',
					explain: '主体内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:content',
					explain: '提示框的内容，定义此 slot 时，会覆盖 props content。',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'on-visible-change',
					explain: '在提示框显示变化时触发',
					type: 'Function:(val)=>{}',
					default: '-',
				},

			];
		}
	}
};
</script>
