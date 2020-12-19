<style lang="scss" scoped>
.demo-scroll {
	height: 200px;
	width: 33%;
	overflow: auto;
	float: left;
	border: 1px solid #ccc;
	padding-top:30px;
}
.demo-scroll > div {
	height: 300%;
	width: 300%;
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Scroll 同步器)</h2>
			<h4 class="padding-top-10">关联滚动同步</h4>
		</vCol>
		<vCol lg="12" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="12" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vScrollSync v-bind="formData">
					<div>
						<div class="demo-scroll" data-scroll-sync>
							<div>vScrollSync1vScrollSync1vScrollSync1vScrollSync1</div>
						</div>
						<div class="demo-scroll" data-scroll-sync>
							<div>vScrollSync2vScrollSync2vScrollSync2</div>
						</div>
						<div class="demo-scroll" data-scroll-sync>
							<div>vScrollSync3vScrollSync3vScrollSync3</div>
						</div>
					</div>
				</vScrollSync>
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

		};
	},
	methods: {

	},
	computed: {
		getCode() {
			return `<vScrollSync v-bind="${this.getCodeString(this.formData)}">
						<div>
							<div class="demo-scroll" data-scroll-sync>
								<div>vScrollSync1</div>
							</div>
							<div class="demo-scroll" data-scroll-sync>
								<div>vScrollSync2</div>
							</div>
							<div class="demo-scroll" data-scroll-sync>
								<div>vScrollSync3</div>
							</div>
						</div>
					</vScrollSync>`;
		},
		getBase() {
			return [
				{
					label: "百分比同步",
					key: "isPercent",
					tag: "vSwitch",
					default: false
				},
				{
					label: "滚动方向",
					key: "scroll",
					tag: "vSelect",
					default: "all",
					options: ['all', 'left', 'top']
				},

			];
		},
		compProps() {
			return [
				{
					explain: "百分比同步",
					prop: "isPercent",
					tag: "Boolean",
					default: false
				},
				{
					explain: "滚动方向：类似overflow的值：'all','left','top'",
					prop: "scroll",
					type: "String",
					default: "all",
				},
				{
					prop: "references",
					explain: "自定义关联联滚动元素",
					type: "elements",
					default: "通过dom的data-scroll-sync属性获取"
				},
				{
					prop: "slot",
					explain: "内容",
					type: "VNode",
					default: "-"
				},
				{
					prop: "on-reach-edge",
					explain: "滚动至顶部或底部时触发:1:底部,0:未触发，-1:顶部",
					type: "Function:Promise",
					default: "(isdown:[1:底部,0:未触发，-1:顶部])=>{}"
				}
			];
		}
	}
};
</script>
