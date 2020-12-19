<style lang="scss" scoped>
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Tag 标签)</h2>
			<h4 class="padding-top-10">对不同维度进行简单的标记和分类。</h4>
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
				<vTag v-bind="formData">标签一</vTag>
				<vTag v-bind="formData">标签二</vTag>
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
			// value: ""
		};
	},
	computed: {
		getCode() {
			return `<vTag v-bind="${this.getCodeString(this.formData)}">标签一</vTag>
					<vTag v-bind="${this.getCodeString(this.formData)}">标签二</vTag>`;
		},
		getBase() {
			return [
				{
					label: "关闭",
					key: "closable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "超出省略",
					key: "ellipsis",
					tag: "vSwitch",
					default: false
				},
				{
					label: "样式类型",
					key: "type",
					tag: "vSelect",
					options: ["border", "dot"]
				},
				{
					label: "尺寸",
					key: "size",
					tag: "vSelect",
					options: ["large", "middle", "small"]
				},
				{
					label: "标签颜色",
					key: "color",
					tag: "vInput",
					options: ["confirm", "gray", "success", "primary", "warning", "error", "info", "danger"]
				},

			];
		},
		compProps() {
			return [
				{
					prop: "name",
					explain: "当前标签的名称",
					type: " String|Number",
					default: ""
				},
				{
					prop: "label",
					explain: "前标签内容",
					type: " String",
					default: ""
				},
				{
					prop: "closable",
					explain: "标签是否可以关闭",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "ellipsis",
					explain: "是否超出省略",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "size",
					explain: "尺寸，可选值为 large、middle、default，small",
					type: "String",
					default: "-"
				},
				{
					prop: "type",
					explain: "标签的样式类型，可选值为 border、dot或不填",
					type: "String",
					default: "-"
				},
				{
					prop: "color",
					explain: "标签颜色：confirm, gray, success, primary, warning, error, info, danger；你也可以自定义颜色值。",
					type: "String",
					default: "-"
				},
				{
					prop: "slot",
					explain: "自定义显示内容",
					type: "VNode",
					default: "-"
				},
				{
					prop: "on-close",
					explain: "关闭时触发",
					type: "Function:(event,name)=>{}",
					default: "-"
				},
			];
		}
	}
};
</script>
