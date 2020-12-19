
<style lang="scss">
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Circle 进度环)</h2>
			<h4 class="padding-top-10">图表类组件。一般有两种用途：1.显示某项任务进度的百分比；2.统计某些指标的占比。</h4>
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
				<vCircle v-model="val" v-bind="formData">{{formData.percent}}%</vCircle>
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
			val1: '',
			val: []
		}
	},
	computed: {
		getCode() {
			return `<vCircle
						 v-bind="${this.getCodeString(this.formData)}">
					</vCircle>
					`
		},
		getBase() {
			return [
				{
					label: "仪表盘",
					key: "dashboard",
					tag: "vSwitch",
					default: true,
				},
				{
					label: "百分比",
					key: "percent",
					tag: "vInputNumber",
					default: 10,
				},
				{
					label: "宽高",
					key: "size",
					tag: "vInputNumber",
					default: 120,
				},
				{
					label: "进度环线宽",
					key: "strokeWidth",
					tag: "vInputNumber",
					default: 6,
				},
				{
					label: "进度环颜色",
					key: "strokeColor",
					tag: "vInput",
					default: "#2db7f5",
					props: {
						type: 'color'
					},
				},
				{
					label: "进度环线宽",
					key: "trackWidth",
					tag: "vInputNumber",
					default: 5,
				},
				{
					label: "进度环颜色",
					key: "trackColor",
					tag: "vInput",
					default: '#eaeef2',
					props: {
						type: 'color'
					},
				},
				{
					label: "环顶端的形状",
					key: "strokeLinecap",
					tag: "vSelect",
					default: "round",
					options: ['square', 'round', 'butt', 'inherit']
				},

			];
		},
		compProps() {
			return [
				{
					explain: "表单名称",
					prop: "name",
					type: 'String',
					default: "-",
				},
				{
					explain: "仪表盘",
					prop: "dashboard",
					type: "vSwitch",
					default: false,
				},
				{
					explain: "百分比",
					prop: "percent",
					type: "vInputNumber",
					default: 0,
				},
				{
					explain: "宽高",
					prop: "size",
					type: "vInputNumber",
					default: 0,
				},
				{
					explain: "进度环线宽",
					prop: "strokeWidth",
					type: "vInputNumber",
					default: 6,
				},
				{
					explain: "进度环颜色",
					prop: "strokeColor",
					type: "vInput",
					default: "#2db7f5",
				},
				{
					explain: "进度环线宽",
					prop: "trackWidth",
					type: "vInputNumber",
					default: 5,
				},
				{
					explain: "进度环颜色",
					prop: "trackColor",
					type: "vInput",
					default: '#eaeef2',
				},
				{
					explain: "多选框的尺寸",
					prop: "size",
					type: "vInput",
					default: "",
				},
				{
					explain: "环顶端的形状:可选值square, round, butt, inherit",
					prop: "strokeLinecap",
					type: "vSelect",
					default: "round",
				},
				{
					explain: "自定义显示中间内容",
					prop: "slot:default",
					type: "VNode",
					default: "",
				},
			];
		}
	},
};
</script>
