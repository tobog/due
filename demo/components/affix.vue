<style lang="scss">
.demo-affix {
	padding: 15px;
	border: 1px solid #ccc;
}
</style>

<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例(Affix 图钉)</h2>
			<h4 class="padding-top-10">使用图钉，可以将内容固定在屏幕上，并且不随页面的滚动而滚动。常用于侧边菜单等。</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="10" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<vAffix v-bind="formData" v-if="show">
				<div class="demo-affix">vAlert offsetBottom</div>
			</vAffix>
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
	data() {
		return {
			formData: {}
		};
	},

	computed: {
		getBase() {
			return [
				{
					label: "距离顶部",
					key: "offsetTop",
					tag: "vInputNumber",
					default: 10
				},
				{
					label: "距离底部",
					key: "offsetBottom",
					tag: "vInputNumber",
					default: 10
				},
				{
					label: "样式z-index",
					key: "zIndex",
					tag: "vInputNumber",
					default: 116
				}
			];
		},
		getCode() {
			return `<vAffix v-bind="${this.getCodeString(this.formData)}">
						<div class="demo-affix">
							vAlert offsetBottom
						</div>
					</vAffix>`;
		},
		compProps() {
			return [
				{
					prop: "offsetTop",
					explain: "距离窗口顶部达到指定偏移量后触发",
					type: "Number",
					default: "-"
				},
				{
					prop: "offsetBottom",
					explain: "距离窗口底部达到指定偏移量后触发",
					type: "Number",
					default: "-"
				},
				{
					prop: "zIndex",
					explain: "fixed 定位的图层级别",
					type: "Number",
					default: "116"
				},
				{
					prop: "on-change",
					explain: "在固定状态发生改变时触发",
					type: "Function:Event",
					default: "false|top|bottom"
				}
			];
		}
	}
};
</script>
