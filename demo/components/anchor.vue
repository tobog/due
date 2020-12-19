<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Anchor 锚点)</h2>
			<h4 class="padding-top-10">用于跳转到页面指定位置</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="10" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<div v-if="show">
				<vAnchor v-bind="formData"></vAnchor>
				<vAnchor target="#Anchor">USER</vAnchor>
			</div>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">Props & Events</h2>
			<vTable
				id="Anchor"
				:columns="getTableColumns"
				:data="compProps"
				class="demo-table"
				border
				stripe
			></vTable>
		</vCol>
	</vRow>
</template>

<script>
export default {
	data() {
		return {
			formData: {}
		};
	},

	computed: {
		getBase() {
			return [
				{
					label: "锚点链接",
					key: "href",
					tag: "vInput",
				},
				{
					label: "文字内容",
					key: "title",
					tag: "vInput",
					default: 'test Anchor'
				},
				{
					label: "非href时，锚点选择器",
					key: "target",
					tag: "vInput",
				},
			];
		},
		getCode() {
			return `<Anchor v-bind="${this.getCodeString(this.formData)}"></Anchor>
				    <Anchor target="#Anchor">USER</Anchor>`;
		},
		compProps() {
			return [
				{
					explain: "锚点链接",
					prop: "href",
					type: "String",
					default: "-"
				},
				{
					explain: "文字内容",
					prop: "title",
					type: "String",
					default: '-'
				},
				{
					explain: "非href时，锚点选择器",
					prop: "target",
					type: "String",
					default: '-'
				},
				{
					explain: "自定义文字内容",
					prop: "slot",
					type: "VNode",
					default: '-'
				},
			];
		}
	}
};
</script>
