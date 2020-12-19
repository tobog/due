<style lang="scss" scoped>
.demo-scroll {
	height: 300px;
	overflow: auto;
	border: 1px solid #ccc;
}
.demo-scroll > div {
	border: 1px solid #ccc;
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Scroll 无限滚动)</h2>
			<h4 class="padding-top-10">常用于滚动至底部时，触发加载更多数据。</h4>
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
				<vScroll v-bind="formData" :on-reach-edge="handleReachEdge" class="demo-scroll">
					<div class="padding-15 margin-15" v-for="(item, index) in list" :key="index">Content {{ item }}</div>
				</vScroll>
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
			list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		};
	},
	methods: {
		handleReachEdge(dir) {
			return new Promise(resolve => {
				setTimeout(() => {
					if (dir < 0) {
						const first = this.list[0];
						for (let i = 1; i < 11; i++) {
							this.list.unshift(first - i);
						}
					} else {
						const last = this.list[this.list.length - 1];
						for (let i = 1; i < 11; i++) {
							this.list.push(last + i);
						}
					}
					resolve();
				}, 3000);
			});
		}
	},
	computed: {
		getCode() {
			return `<vScroll v-bind="${this.getCodeString(this.formData)}" :on-reach-edge="handleReachEdge" class="demo-scroll">
						<div class="padding-15 margin-15" v-for="(item, index) in list" :key="index">Content {{ item }}</div>
					</vScroll>`;
		},
		getBase() {
			return [
				{
					label: "顶部加载",
					key: "isReachTop",
					tag: "vSwitch",
					default: true
				},
				{
					label: "触发回调距离",
					key: "offset",
					tag: "vInputNumber",
					default: 30
				},
				// {
				// 	label: "性能",
				// 	key: "performance",
				// 	tag: "vSelect",
				// 	default: "",
				// 	options: ['none', 'middle', 'high']
				// },
				{
					label: "高度",
					key: "height",
					tag: "vInputNumber",
					default: 200
				},
			];
		},
		compProps() {
			return [
				{
					explain: "顶部加载",
					prop: "isReachTop",
					type: "Boolean",
					default: true
				},
				{
					explain: "触发回调距离",
					prop: "offset",
					type: "Number",
					default: 30
				},
				{
					explain: "高度",
					prop: "height",
					type: "Number",
					default: 300
				},
				{
					prop: "slot",
					explain: "内容",
					type: "VNode",
					default: "-"
				},
				{
					prop: "slot:loading",
					explain: "加载中的文案",
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
