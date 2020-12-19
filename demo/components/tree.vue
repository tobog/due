
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Tree 树形控件)</h2>
			<h4 class="padding-top-10">
				文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用树控件可以完整展现其中的层级关系，并具有展开收起选择等交互功能。
			</h4>
		</vCol>
		<vCol span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vTree
					:data="datalist"
					v-bind="formData"
					style="height:300px;"
				></vTree>
			</section>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">Props & Events</h2>
			<vTable
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
		// ${this.getCodeString(this.formData)}
		data() {
			return {
				val: "",
				datalist: [],
				value: []
			};
		},
		created() {
			this.mockData();
		},
		methods: {
			mockData() {
				this.datalist = [
					{
						title: "1123",
						id: "30", //key,
						selected: true,
						icon: "success"
					},
					{
						title: "title1",
						key: "1", //key
						icon: "success",
						expand: true,
						children: [
							{
								title: "title2",
								id: "2", //key,
								icon: "success",
								children: [
									{
										title: "====",
										id: "3", //key,
										selected: true,
										icon: "success",
										children: [
											{
												title: "===ss=",
												id: "30", //key,
												selected: true,
												icon: "success"
											},
											{
												title: "1123",
												id: "30", //key,
												selected: true,
												icon: "success"
											}
										]
									}
								]
							},
							// {
							// 	title: "fffffffffffffffffff",
							// 	id: "4", //key,
							// 	selected: true,
							// 	icon: "success"
							// },
							// {
							// 	title: "tisfdftle4",
							// 	id: "5", //key,
							// 	selected: false,
							// 	icon: "success"
							// },
							{
								title: "sfdsfd",
								id: "6", //key,
								icon: "success"
								// children: [
								// 	{
								// 		title: "sfsf",
								// 		id: "30", //key,
								// 		selected: true,
								// 		icon: "success"
								// 	},
								// 	{
								// 		title: "title6",
								// 		id: "7", //key,
								// 		selected: true,
								// 		icon: "success",
								// 		children: [
								// 			{
								// 				title: "title7",
								// 				id: "8", //key,
								// 				selected: false,
								// 				icon: "success"
								// 			},
								// 			{
								// 				title: "1123",
								// 				id: "30", //key,
								// 				selected: true,
								// 				icon: "success"
								// 			}
								// 		]
								// 	}
								// ]
							}
						]
					}
				];
			}
		},
		computed: {
			getCode() {
				return `
						<vTree
							:data="datalist"
							v-bind="${this.getCodeString(this.formData)}"
							style="height:300px;"
						></vTree>`;
			},
			getBase() {
				return [
					{
						label: "拖动",
						key: "draggable",
						tag: "vSwitch",
						default: false
					},
					{
						label: "支持多选",
						key: "multiple",
						tag: "vSwitch",
						default: false
					},
					{
						label: "显示多选框",
						key: "selection",
						tag: "vSwitch",
						default: false
					},
					{
						label: "展开所有节点",
						key: "always",
						tag: "vSwitch",
						default: false
					},
					{
						label: "横向展开",
						key: "isTransverse",
						tag: "vSwitch",
						default: false
					},
					{
						label: "缩进",
						key: "indent",
						tag: "vSwitch",
						default: true
					},
					{
						label: "仅选中自己",
						key: "selectOnlySelf",
						tag: "vSwitch",
						default: false
					},
					{
						label: "drag提示类型",
						key: "dragTip",
						tag: "vSelect",
						default: "line",
						options: ["line", "popper", "all", "none"]
					},
					{
						label: "类型",
						key: "type",
						tag: "vSelect",
						default: "tree",
						options: ["tree", "menu"]
					},
					{
						label: "主题",
						key: "theme",
						tag: "vSelect",
						default: "",
						options: ["light", "dark", "primary"]
					}
				];
			},
			compProps() {
				return [
					{
						prop: "data",
						explain:
							"可嵌套的节点属性的数组，生成 tree 的数据",
						type: "Array",
						default: ""
					},
					{
						prop: "multiple",
						explain: "是否支持多选",
						type: "Boolean",
						default: "-"
					},
					{
						prop: "draggable",
						explain: "拖动",
						type: "Boolean",
						default: "-"
					},
					{
						prop: "render",
						explain: "自定义渲染内容",
						type: "Function",
						default: "-"
					},
					{
						prop: "selection",
						explain: "是否显示多选框",
						type: "Boolean",
						default: "-"
					},
					{
						prop: "always",
						explain: "一直展开直子节点",
						type: "Boolean",
						default: "-"
					},
					{
						prop: "type",
						explain: "树组件类型：tree，menu",
						type: "String",
						default: "tree"
					},
					{
						prop: "theme",
						explain: "主题：dark light，primary",
						type: "String",
						default: 'light'
					},
					{
						prop: "isTransverse",
						explain: "是否横向展开",
						type: "Boolean",
						default: "false"
					},
					{
						explain:"drag提示类型：line，popper，all,none",
						prop: "dragTip",
						type: "String",
						default:"line"
					},
					{
						prop: "indent",
						explain: "是否缩进",
						type: "Boolean",
						default: "true"
					},
					{
						prop: "selectOnlySelf",
						explain: "仅选中自己",
						type: "Boolean",
						default: "false"
					},{
						prop: "initStatus",
						explain: "初始换展开",
						type: "Function:(key,val)=>{}",
						default: "-"
					},
					{
						prop: "on-expand-change",
						explain: "展开和收起子列表时触发",
						type: "Function:(expand,node)=>{}",
						default: "-"
					},
					{
						prop: "on-select-change",
						explain: "点击复选框时触发",
						type: "Function:(val,node,selectedVals,indeterminateVals)=>{}",
						default: "-"
					},
					{
						prop: "on-drop-change",
						explain: "移动位置时触发",
						type: "Function:(dragNode,dropNode,type)=>{}",
						default: "-"
					},
					{
						prop: "slot",
						explain: "自定义图标",
						type:"Boolean",
						default: "-"
					},
					{
						prop: "children：title",
						explain: "标题,",
						type:"String",
						default: "-"
					},
					{
						prop: "children:icon",
						explain: "图标",
						type:"String",
						default: "-"
					},
					{
						prop: "children:iconType",
						explain: "图标类型：html，或无",
						type:"String",
						default: "-"
					},
					{
						prop: "children:selected",
						explain: "是否选节点",
						type:"Boolean",
						default: "-"
					},
					{
						prop: "children:disabled",
						explain: "禁掉 checkbox",
						type:"Boolean",
						default: "-"
					},
					{
						prop: "children:children",
						explain: "子节点属性数组",
						type:"Array",
						default: "-"
					},
					{
						prop: "children:selectOnlySelf",
						explain: "仅选中自己",
						type:"Boolean",
						default: "-"
					},
					{
						prop: "children:render",
						explain: "自定义当前节点渲染内容",
						type:"Function",
						default: "-"
					},
					{
						prop: "children:expand",
						explain: "是否展开直子节点",
						type:"Boolean",
						default: "-"
					},
					{
						prop: "children:props",
						explain: "节点属性，类似组件props",
						type:"object",
						default: "-"
					},

					

				];
			}
		}
	};
</script>
