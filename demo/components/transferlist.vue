
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Transfer 穿梭框)</h2>
			<h4 class="padding-top-10">双栏穿梭选择框，常用于将多个项目从一边移动到另一边。</h4>
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
				<vTransfer v-bind="formData" v-model="value" @on-transfer="transfer" :data="datalist">
					<div :style="{ float: 'right', padding: '5px' }">
						<vButton size="small" theme="success" @click="mockData">Refresh</vButton>
					</div>
				</vTransfer>
				{{value}}
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
			datalist: [],
			value: []

		};
	},
	created() {
		this.mockData();
	},
	methods: {
		transfer() {

		},
		mockData() {
			let mockData = [];
			for (let i = 1; i <= 30; i++) {
				mockData.push({
					key: i.toString(),
					label: "Content " + i,
					description: "The desc of content  " + i,
					disabled: Math.random() * 3 < 1
				});
			}
			this.datalist = mockData;
		}
	},
	computed: {
		getCode() {
			return `
				<vTooltip v-bind="${this.getCodeString(this.formData)}">
					<vButton>vButton</vButton>
					<div slot="content">{{${this.getCodeString(this.formData)}}}</div>
				</vTooltip>
				<vTooltip v-bind="${this.getCodeString(this.formData)}">
					<vButton>Long Content</vButton>
					<div slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</div>
				</vTooltip>`;
		},
		getBase() {
			return [
				{
					label: "搜索框",
					key: "filterable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "拖拽",
					key: "draggable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "源数据下标",
					key: "originIndex",
					tag: "vInputNumber",
					default: 0
				},
				{
					label: "分组",
					key: "group",
					tag: "vInputNumber",
					default: 3
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'data',
					explain: '数据源，其中的数据将会被渲染到左边一栏中，value 中指定的除外。',
					type: 'Array',
					default: '',
				},
				{
					prop: 'name',
					explain: '表单字段name',
					type: 'String',
					default: "-",
				},
				{
					prop: 'value',
					explain: 'v-model:group<2时显示待选框数据的key集合group>=2,所有框的对应集合，',
					type: 'Array|Map',
					default: "[]",
				},
				{
					prop: 'renderFormat',
					explain: '每行数据渲染函数，该函数的入参为 data 中的项',
					type: 'Funtion:(item)=>String',
					default: 'item.label|| item.title||item.name',
				},
				{
					prop: 'listStyle',
					explain: '两个穿梭框的自定义样式',
					type: 'Object|String',
					default: '-',
				},
				{
					prop: 'titles',
					explain: '标题集合，顺序从左至右',
					type: 'Array',
					default: '["源列表", "目的列表"]',
				},
				{
					prop: 'filterable',
					explain: '是否显示搜索框',
					type: 'Boolean',
					default: 'false',
				},
				{
					explain: "自定义搜索函数，入参为 data 和 query，data 为项，query 为当前输入的搜索词",
					prop: "filterMethod",
					type: 'Funtion:(item,query)=>Boolean',
					default: "(item,query)=>new RegExp(query, i).test(this.renderFormat(item))"
				},
				{
					prop: 'slot',
					explain: '自定义底部内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'on-selected-change',
					explain: '选中项发生变化时触发',
					type: 'Function:(checkedKeys,targetIndex,targetKeys)=>{}',
					default: '-',
				},
				{
					prop: 'input',
					explain: '选项在两栏之间转移变化时触发',
					type: 'Function:(targetKeys|allKeys)=>{}',
					default: '-',
				},
				{
					prop: 'on-transfer',
					explain: '选项在两栏之间转移变化时触发,',
					type: 'Function:(checkedKeys,targetIndex,allKeys,originIndex)=>{}',
					default: '-',
				},

			];
		}
	}
};
</script>
