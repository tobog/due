
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Notice 通知提醒和Message组件一样)</h2>
			<h4 class="padding-top-10">
				在界面右上角显示可关闭的全局通知，常用于以下场景：
				<div>通知内容带有描述信息</div>
				<div>系统主动推送</div>
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
				<vButton @click="notice('default')">default</vButton>
				<vButton @click="notice('info')">info</vButton>
				<vButton @click="notice('success')">success</vButton>
				<vButton @click="notice('warning')">warning</vButton>
				<vButton @click="notice('error')">error</vButton>
				<vButton @click="destroyed">destroy</vButton>
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
			<div class="color-warn padding-5">this.$Notice.config(config,isVmOptions)</div>
			<div class="color-warn padding-5">this.$Notice.info(props)</div>
			<div class="color-warn padding-5">this.$Notice.success(props)</div>
			<div class="color-warn padding-5">this.$Notice.warning(props)</div>
			<div class="color-warn padding-5">this.$Notice.error(props,clear)</div>
			<div class="color-warn padding-5">this.$Notice.default(props)</div>
			<div class="color-warn padding-5">this.$Notice.destroy(immediate)</div>
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
			return `notice(type = "info") {
						this.$VNotice[type](this.formData);
					},
					destroy(name, istheme) {
						this.$VNotice['destroy'](name, istheme)
					},
					destroyed() {
						this.$VNotice['destroy']()
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
					label: "通知提醒的标题",
					key: "title",
					tag: "vTextarea",
					default: "通知提醒的标题"
				},
				{
					label: "提示内容",
					key: "desc",
					tag: "vTextarea",
					default: "message"
				},

			];
		},
		compProps() {
			return [
				{
					prop: "desc",
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
					prop: "JS:render",
					explain: "自定义渲染函数",
					type: "Function",
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
		notice(type = "info", only) {
			this.$VNotice[type](this.formData);
		},
		destroy(name, istheme) {
			this.$VNotice['destroy'](name, istheme)
		},
		destroyed(name, istheme) {
			this.$VNotice['destroy']()
		}
	},
};
</script>
