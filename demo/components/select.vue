



<template>
	<main style="padding:20px 0;" class="examples-main clearfix">
		<vForm class="example" vertical>
			<div style="padding:10px 0;">参数：</div>
			<vFormItem v-for="(item,key) of switchs" :key="key" label-width="100" :label="key">
				<vSwitch v-model="switchs[key]"/>
			</vFormItem>
			<vFormItem v-for="(item,key) of selects" :key="key" label-width="100" :label="key">
				<vSelect v-model="selects[key]" transfer>
					<vOption v-for="(val,index) of options[key]" :value="val" :key="index"></vOption>
				</vSelect>
			</vFormItem>
			<vFormItem v-for="(item,key) of inputs" :key="key" label-width="100" :label="key">
				<vInput v-model="inputs[key]"></vInput>
			</vFormItem>
		</vForm>
		<section class="example" v-if="attrs.show">
			<div style="padding:10px 0;">视图：</div>
			<vSelect v-model="val" v-bind="attrs" style="margin-bottom:30px;">
				<vOption v-for="index in count" :value="index" :key="index">{{index+'ba'}}</vOption>
			</vSelect>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			val: 3,
			count: 20,
			switchs: {
				show: true,
				disabled: false,
				multiple: false,
				clearable: false,
				filterable: true,
				transfer: true,
				readonly: false,
				strict: true,
				value: false,
				search: false,
				autoClose: true,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				label: 20,
				dropStyle: "",
			},
		};
	},
	methods: {
		loading() {
			this.count += 10;
		}
	},
	computed: {
		style() {
			return this.switchs.vertical ? 'height:300px;vertical-align:top;' : null
		},
		attrs() {
			return {
				...this.selects,
				...this.switchs,
				...this.inputs,
			}
		},
		columns() {
			return [{
				title: '属性/事件/方法',
				key: 'prop',
			},
			{
				title: '说明',
				key: 'explain',
				width: '50%'
			},
			{
				title: '类型',
				key: 'type',
			},
			{
				title: '默认值/参数/返回值',
				key: 'default',
			},
			]
		},
		data() {
			return [{
				prop: "name",
				explain: "input name",
				type: "String",
				default: "-"
			},
			{
				prop: "value",
				explain: "指定选中项目的 value 值，可以使用 v-model 双向绑定数据。单选时只接受 String 或 Number，多选时只接受 Array",
				type: "String | Number | Array",
				default: '-'
			},
			{
				prop: "multiple",
				explain: "是否支持多选",
				type: "Boolean",
				default: false
			},
			{
				prop: "disabled",
				explain: "是否禁用",
				type: "Boolean",
				default: false
			},
			{
				prop: "clearable",
				explain: "是否可以清空选项，只在单选时有效",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "filterable",
				explain: "是否支持搜索",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "search",
				explain: "是否使用远程搜索",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "on-search",
				explain: "远程搜索的事件",
				type: "	Function:valtext,model=>{}",
				default: "-"
			},
			{
				prop: "$attrs",
				explain: "input继承$attrs",
				type: "object",
				default: "-"
			},
			{
				prop: "transfer",
				explain: "是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果",
				type: "Boolean",
				default: false
			},
			{
				prop: "strict",
				explain: "strict模式",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "readonly",
				explain: "readonly",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "autoClose",
				explain: "auto Close",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "dropStyle",
				explain: "drop Style",
				type: "Object",
				default: "-"
			},

			{
				prop: "on-scroll-loading",
				explain: "事件",
				type: "Function： (this.model, this.valueText, event)=>{}",
				default: '-'
			},
			{
				prop: "on-match",
				explain: "事件",
				type: "Function： (bool)=>{}",
				default: '-'
			},
			{
				prop: "on-blur/on-focus/on-change/on-enter",
				explain: "事件",
				type: "Function： (this.model, this.valueText, event)=>{}",
				default: '-'
			},
			{
				prop: "on-visible-change",
				explain: "visible事件",
				type: "Function： (val)=>{}",
				default: '-'
			},
			{
				prop: "slot",
				explain: "Option内容",
				type: "VNode",
				default: "-"
			},
			{
				prop: 'on-change',
				explain: '-',
				type: 'Function:event',
				default: '-',
			},
			{
				prop: "value",
				explain: "Option:value",
				type: "-",
				default: "-"
			}, {
				prop: "label",
				explain: "Option:label",
				type: "-",
				default: "-"
			}, {
				prop: "disabled",
				explain: "Option:disabled",
				type: "Boolean",
				default: "-"
			}, {
				prop: "strict",
				explain: "Option:strict",
				type: "Boolean",
				default: "-"
			},
			]
		}
	},
};
</script>

