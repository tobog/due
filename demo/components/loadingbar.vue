
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (LoadingBar 加载进度条)</h2>
			<h4 class="padding-top-10">全局创建一个显示页面加载、异步请求、文件上传等的加载进度条。</h4>
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
				<vButton @click="vLoadingBar('config')">config</vButton>
				<vButton @click="vLoadingBar('start')">start</vButton>
				<vButton @click="vLoadingBar('update')">update</vButton>
				<vButton @click="vLoadingBar('finish')">finish</vButton>
				<vButton @click="vLoadingBar('error')">error</vButton>
				<vButton @click="vLoadingBar('destroy')">destroy</vButton>
			</section>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="js"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">通过直接调用以下方法来使用组件：</h2>
			<div class="color-warn padding-5">this.$Loading.config(config,isVmOptions)</div>
			<div class="color-warn padding-5">this.$Loading.start(props)</div>
			<div class="color-warn padding-5">this.$Loading.finish(props)</div>
			<div class="color-warn padding-5">this.$Loading.error(props)</div>
			<div class="color-warn padding-5">this.$Loading.update(props,clear)</div>
			<div class="color-warn padding-5">this.$Loading.destroy(immediate)</div>
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
			return `this.$VLoading.config({
						color: '#5cb85c',
						failedColor: '#f0ad4e',
						height: 5
					});`;
		},
		getBase() {
			return [
				{
					label: "失败颜色",
					key: "failColor",
					tag: "vInput",
					default: "-",
					props: {
						type: 'color'
					},
				},
				{
					label: "默认颜色",
					key: "color",
					tag: "vInput",
					default: "-",
					props: {
						type: 'color'
					},
				},
				{
					label: "进度条高度",
					key: "height",
					tag: "vInputNumber",
					default: 3
				},
			];
		},
		compProps() {
			return [
				{
					explain: "失败颜色",
					prop: "failColor",
					type: "String",
					default: "error",
				},
				{
					explain: "进度条的颜色",
					prop: "color",
					type: "String",
					default: "success",
				},
				{
					explain: "进度条高度",
					prop: "height",
					type: "Number",
					default: 3
				},
				{
					prop: 'config|start|update|finish|destroy',
					explain: '通过直接调用以下方法来使用组件',
					type: 'Function:options',
					default: 'options',
				},
			];
		}
	},
	methods: {
		vLoadingBar(type) {
			this.$VLoadingBar[type](this.formData)
		},
	},
};
</script>
