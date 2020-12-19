<style lang="scss">
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Button 按钮)</h2>
			<h4 class="padding-top-10">基础组件，触发业务逻辑时使用。</h4>
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
				<vButton v-bind="formData" to="/button">vButton</vButton>
				<vButtonGroup v-bind="formData" class="margin-top-20">
					<vButton v-bind="formData">vButton</vButton>
					<vButton v-bind="formData">vButton</vButton>
					<vButton v-bind="formData">vButton</vButton>
				</vButtonGroup>
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
	computed: {
		getCode() {
			return `<vButton v-bind="${this.getCodeString(this.formData)}">vButton</vButton>
					<vButtonGroup v-bind="${this.getCodeString(this.formData)}" class="margin-top-20">
						<vButton v-bind="${this.getCodeString(this.formData)}">vButton</vButton>
						<vButton v-bind="${this.getCodeString(this.formData)}">vButton</vButton>
					</vButtonGroup>`
		},
		getBase() {
			return [
				{
					label: "纵向排列",
					key: "vertical",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "紧凑排列",
					key: "compact",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "幽灵属性",
					key: "ghost",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "禁用状态",
					key: "disabled",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "长度100%",
					key: "long",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "loading",
					key: "loading",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "按钮类型",
					key: "theme",
					tag: "vSelect",
					options: [
						'primary',
						'dashed',
						'text',
						'info',
						'success',
						'warning',
						'error',
						'default',
						'confirm'
					],
				},
				{
					label: "按钮形状",
					key: "shape",
					tag: "vSelect",
					options: [
						'circle'
					],
				},
				{
					label: "按钮大小",
					key: "size",
					tag: "vSelect",
					options: ['small', 'large', 'default'],
				},
				{
					label: "icon",
					key: "icon",
					tag: "vSelect",
					options: this.iconslist,
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'ButtonGroup:vertical',
					explain: '是否纵向排列按钮组',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'BreadItem:compact',
					explain: '是否紧凑排列',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'ghost',
					explain: '幽灵属性',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'disabled',
					explain: '禁用状态',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'long',
					explain: '是否长度100%',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'loading',
					explain: '按钮为加载中状态',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'theme',
					explain: '按钮类型:可选值为 gray、primary、dashed、text、info、success、warning、error',
					type: 'String',
					default: '-',
				},
				{
					prop: 'type',
					explain: '表单类型:可选值为button,reset,submit',
					type: 'String',
					default: '-',
				},
				{
					prop: 'shape',
					explain: '按钮形状:可选值为circle',
					type: 'String',
					default: '-',
				},
				{
					prop: 'size',
					explain: '按钮大小:small, large, default',
					type: 'String',
					default: 'default',
				},
				{
					prop: 'icon',
					explain: '图标',
					type: 'String',
					default: '-',
				},
				{
					prop: 'to',
					explain: 'router-link标签模式 渲染',
					type: 'String',
					default: '-',
				},
				{
					prop: 'href',
					explain: 'a 标签模式 渲染',
					type: 'String',
					default: '-',
				},
				{
					prop: '$listeners',
					explain: '继承事件',
					type: 'String',
					default: '-',
				},
				{
					prop: '$attrs',
					explain: '继承属性：tag，to，href 等。。。',
					type: 'String',
					default: '-',
				},
			];
		}
	},
};
</script>
