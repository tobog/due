
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
			<vRadio v-model="value" v-bind="attrs" true-value="2">Radio</vRadio>
			<vRadio v-model="value" v-bind="attrs" true-value="3">Radio1</vRadio>
			<vRadio v-model="value" v-bind="attrs" true-value="5">Radio2</vRadio>
			<vRadio v-model="value" v-bind="attrs" true-value="6" size='auto'>
				<vButton
                    slot='content'
                    slot-scope="{active}"
                    :theme="active?'primary':'default'"
                >active</vButton>
			</vRadio>
			{{value}}
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			value:'',
			switchs: {
				show:true,
				disabled: true,
				strict: false,
			},
			selects: {
		
			},
			options: {
			
			},
			inputs: {
				label: 20,
				size: 30,
			},
		};
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
				prop: "value",
				explain: "可以使用 v-model 双向绑定数据",
				type: "String, Number, Boolean",
				default: "false"
			},
			{
				prop: "trueValue",
				explain: "trueValue",
				type: "String, Number, Boolean",
				default: "true"
			},
			{
				prop: "falseValue",
				explain: "falseValue",
				type: "String, Number, Boolean",
				default: "false"
			},
			{
				prop: "label",
				explain: "指定当前选项的 value 值，组合会自动判断当前选择的项目",
				type: "String, Number",
				default: "-"
			},
			{
				prop: "disabled",
				explain: "是否禁用当前项",
				type: "Boolean",
				default: "false"
			},
			{
				prop: "strict",
				explain: "严格相等",
				type: "Boolean",
				default: "true"
			},
			{
				prop: "size",
				explain: "单选框的尺寸，large、small、default，number",
				type: "String, Number",
				default: "-"
			},
			
			{
				prop: "on-change",
				explain: "事件",
				type: "Function： (val,event)=>{}",
				default: '-'
			},

			{
				prop: "slot：content",
				explain: "自定义显示状态内容",
				type: "VNode",
				default: "-"
			},
			{
				prop: "slot",
				explain: "自定义label",
				type: "VNode",
				default: "-"
			},
			]
		}
	},
};
</script>

