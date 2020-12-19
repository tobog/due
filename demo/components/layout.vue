<style lang="scss" scoped>
.demo-layout-content {
	min-height: 100px;
	background: #ff9900;
	width: 100%;
}
.demo-layout-header,
.demo-layout-footer {
	background: #5cadff;
	height:100%;
}
.demo-layout-footer {
	min-height: 100px;
	background: #2db7f5;
	height: 100%;
}
.demo-layout-slider {
	background-color: #ddd;
	height: 100%;
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Layout 布局)</h2>
			<h4 class="padding-top-10">协助进行页面级整体布局。</h4>
		</vCol>
		<vCol lg="24" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="24" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show" class="demo-fixed">
				<vLayout v-bind="formData">
					<div slot="header" class="demo-layout-header">header</div>
					<div slot="slider" class="demo-layout-slider">slider</div>
					<div slot="footer" class="demo-layout-footer">footer</div>
					<div class="demo-layout-content">content</div>
				</vLayout>
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
			iconName: ''
		};
	},
	computed: {
		getCode() {
			return `<vLayout v-bind="${this.getCodeString(this.formData)}">
						<div slot="header" class="demo-layout-header">header</div>
						<div slot="slider" class="demo-layout-slider">slider</div>
						<div slot="footer" class="demo-layout-footer">footer</div>
						<div class="demo-layout">content</div>
					</vLayout>`;
		},
		getBase() {
			return [
				{
					label: "定位头",
					key: "fixHeader",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "定位侧边栏",
					key: "fixSlider",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "内部定位侧边栏",
					key: "insideMode",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "头高",
					key: "headerHeight",
					tag: "vInputNumber",
					default: 64,
				},
				{
					label: "侧边栏宽",
					key: "sliderWidth",
					tag: "vInputNumber",
					default: 200,
				},

			];
		},
		compProps() {
			return [
				{
					prop: 'fixHeader',
					explain: '定位头',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'headerHeight',
					explain: '头高',
					type: 'Number',
					default: '64',
				},
				{
					prop: 'fixSlider',
					explain: '定位侧边栏',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'sliderWidth',
					explain: '侧边栏宽',
					type: 'Number',
					default: '200',
				},
				{
					prop: 'slot:default',
					explain: '内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:footer',
					explain: '尾页',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:slider',
					explain: '侧边栏',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:header',
					explain: '头',
					type: 'VNode',
					default: '-',
				},
			];
		}
	}
};
</script>
