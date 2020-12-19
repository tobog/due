<style lang="scss" scoped>
.demo-split {
	height: 200px;
	border: 1px solid #ccc;
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Split 面板分割)</h2>
			<h4 class="padding-top-10">可将一片区域，分割为可以拖拽调整宽度或高度的两部分区域。</h4>
		</vCol>
		<vCol lg="24" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="24" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vSplit v-model="val" v-bind="formData" class="demo-split">
					<div>1</div>
					<vSplit slot="split" vertical>
						<div>2</div>
						<vSplit v-model="val1" slot="split">
							<div>3</div>
							<div slot="split">Right Pane</div>
						</vSplit>
					</vSplit>
				</vSplit>
				{{ val }}
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
			val: 30,
			val1: 20
		};
	},
	methods: {},
	computed: {
		getCode() {
			return `<vSplit v-model="val" v-bind="${this.getCodeString(this.formData)}" class="demo-split">
						<div>1</div>
						<vSplit slot="split" vertical>
							<div>2</div>
							<vSplit v-model="val1" slot="split">
								<div>3</div>
								<div slot="split">Right Pane</div>
							</vSplit>
						</vSplit>
					</vSplit>`;
		},
		getBase() {
			return [
				{
					label: "最小值",
					key: "min",
					tag: "vInputNumber",
					default: 0
				},
				{
					label: "最大值",
					key: "max",
					tag: "vInputNumber",
					default: 100
				},
				{
					label: "垂直分割",
					key: "vertical",
					tag: "vSwitch",
					default: false
				}
			];
		},
		compProps() {
			return [
				{
					explain: "垂直分割",
					prop: "vertical",
					type: "Boolean",
					default: false
				},
				{
					explain: "最小值",
					prop: "min",
					type: "Number",
					default: 0
				},
				{
					explain: "最大值",
					prop: "max",
					type: "Number",
					default: 100
				},
				{
					prop: "on-change",
					explain: "在滑动过程中不会触发",
					type: "Function:Event",
					default: "-"
				},
				{
					prop: "on-move",
					explain:
						"滑动条数据变化时触发，返回当前的选值，在滑动过程中实时触发",
					type: "Function:Event",
					default: "-"
				}
			];
		}
	}
};
</script>
