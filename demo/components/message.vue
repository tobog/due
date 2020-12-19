
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Message 全局提示)</h2>
			<h4 class="padding-top-10">轻量级的信息反馈组件，在顶部居中显示，并自动消失。有多种不同的提示状态可选择。</h4>
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
				<vButton @click="messages('info')">info</vButton>
				<vButton @click="messages('success')">success</vButton>
				<vButton @click="messages('error')">error</vButton>
				<vButton @click="messages('loading')">loading</vButton>
				<vButton @click="destroyed">destroy</vButton>
				<vButton @click="messages('loading',true)">single</vButton>
				<vButton @click="destroy('success',true)">destroy success istheme</vButton>
			</section>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="js"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">通过直接调用以下方法来使用组件：</h2>
			<div class="color-warn padding-5">this.$Message.config(config,isVmOptions)</div>
			<div class="color-warn padding-5">this.$Message.info(props)</div>
			<div class="color-warn padding-5">this.$Message.success(props)</div>
			<div class="color-warn padding-5">this.$Message.warning(props)</div>
			<div class="color-warn padding-5">this.$Message.error(props,clear)</div>
			<div class="color-warn padding-5">this.$Message.loading(props)</div>
			<div class="color-warn padding-5">this.$Message.default(props)</div>
			<div class="color-warn padding-5">this.$Message.destroy(immediate)</div>
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
			return `messages(type = "info", only) {
						this.$VMessage[type](this.formData, only);
					},
					destroy(name, istheme) {
						this.$VMessage['destroy'](name, istheme)
					},
					destroyed() {
						this.$VMessage['destroy']()
					}`;
		},
		getBase() {
			return [
				{
					label: "关闭按钮",
					key: "closable",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "遮罩",
					key: "maskable",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "延时关闭",
					key: "duration",
					tag: "vInputNumber",
					default: 5
				},
				{
					label: "唯一标识name",
					key: "name",
					tag: "vInput",
					default: "",
				},
				{
					label: "提示内容",
					key: "content",
					tag: "vTextarea",
					default: "message"
				},

			];
		},
		compProps() {
			return [
				{
					prop: "content",
					explain: "提示内容",
					type: "String",
					default: "-"
				},
				{
					prop: "closable",
					explain: "关闭时的回调",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "duration",
					explain: "自动关闭的延时，单位秒，不关闭可以写 0",
					type: "Number",
					default: 5
				},
				{
					prop: "className",
					explain: "className",
					type: "String",
					default: "move-up"
				},
				{
					prop: "动画Name",
					explain: "transitionName",
					type: "String",
					default: "-"
				},
				{
					prop: "name",
					explain: "唯一标识name，必须配置，为函数调用参数使用",
					type: "String",
					default: ""
				},
				{
					prop: "onClose",
					explain: "回调函数",
					type: "Function",
					default: "-"
				},
				{
					prop: "render",
					explain: "自定义描述内容，使用 Vue 的 Render 函数",
					type: "Function",
					default: "Function:h=>{}"
				},
				{
					prop: "single",
					explain: "单一显示single，js模式",
					type: "Boolean",
					default: "-"
				},

				{
					prop: 'config|default|info|success|error|destroy|warning',
					explain: '通过直接调用以下方法来使用组件',
					type: 'Function:( options, single)',
					default: 'options',
				},
				{
					prop: "JS:destroy:isTheme",
					explain: "是否按照主题销毁",
					type: "Boolean",
					default: "-"
				},
				{
					prop: "JS:options",
					explain: "就是调用属性：maskable,content ,closable = true,onClose,render,duration,name,style,className,ghost",
					type: "Object",
					default: "-"
				},
			];
		}
	},
	methods: {
		messages(type = "info", only) {
			this.$VMessage[type](this.formData, only);
		},
		destroy(name, istheme) {
			this.$VMessage['destroy'](name, istheme)
		},
		destroyed(name, istheme) {
			this.$VMessage['destroy']()
		}
	},
};
</script>
