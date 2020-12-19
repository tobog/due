
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Loading 加载中)</h2>
			<h4 class="padding-top-10">当区块正在获取数据中时可使用，适当的等待动画可以提升用户体验。</h4>
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
				<vLoading v-bind="formData" style="height:200px;border:1px solid #ccc">
					<div slot="label">title</div>
				</vLoading>
				<vButton @click="handleLoading('show')">show</vButton>
				<vButton @click="handleLoading('init')">init</vButton>
				<vButton @click="handleLoading('destroy')">destroy</vButton>
				<vButton @click="handleLoading('hide')">hide</vButton>
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
			val: '',
		};
	},
	computed: {
		getCode() {
			return `<vLoading v-bind="formData">
						<div slot="label">title</div>
					</vLoading>
					<vButton @click="handleLoading('show')">show</vButton>
					<vButton @click="handleLoading('init')">init</vButton>
					<vButton @click="handleLoading('destroy')">destroy</vButton>
					<vButton @click="handleLoading('hide')">hide</vButton>`;
		},
		getBase() {
			return [
				{
					label: "是否固定",
					key: "fix",
					tag: "vSwitch",
					default: false
				},
				{
					label: "全局覆盖",
					key: "transfer",
					tag: "vSwitch",
					default: false
				},
				{
					label: "全屏",
					key: "fullscreen",
					tag: "vSwitch",
					default: false
				},
				{
					label: "显示loading",
					key: "loading",
					tag: "vSwitch",
					default: true
				},
				{
					label: "可关闭",
					key: "closable",
					tag: "vSwitch",
					default: true
				},
				{
					label: "延迟时间",
					key: "delay",
					tag: "vInputNumber",
					// default: ""
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'fix',
					explain: '是否固定，需要父级有relative或absolute',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'transfer',
					explain: '位于body下全局覆盖',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'fullscreen',
					explain: '是否可以全屏',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'loading',
					explain: '是否显示loading',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'closable',
					explain: '是否可关闭',
					type: 'Boolean',
					default: 'true',
				},
				{
					prop: 'on-fullscreenchange',
					explain: '全屏事件',
					type: 'Event',
					default: '(val)=>{}',
				},
				{
					prop: 'on-close',
					explain: '关闭事件',
					type: 'Event',
					default: '()=>{}',
				},
				{
					prop: 'config|init|hide|show|destroy|get',
					explain: '通过this.$VLoading：js直接调用以下方法来使用组件,提供name处理特定loading',
					type: 'Function:options=》Instances.name默认vue._uid',
					default: '-',
				},
			];
		}
	},
	methods: {
		handleLoading(type) {
			this.$VLoading[type]()
		},
	},
};
</script>
