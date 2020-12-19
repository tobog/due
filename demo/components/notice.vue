
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
		<section class="example">
			<vButton @click="notice('info')">info</vButton>
			<vButton @click="notice('success')">success</vButton>
			<vButton @click="notice('error')">error</vButton>
			<vButton @click="notice('default')">default</vButton>
			<vButton @click="notice('warning')">warning</vButton>
			<vButton @click="destroyed">destroy</vButton>
			<vButton @click="destroy('success',true)">destroy success istheme</vButton>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			switchs: {
				closable: false,
				ghost: false,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				duration: 6,
				title: "VNotice",
				desc: "desc",
				name: "",
				transitionName: ""
			},
		};
	},
	methods: {
		notice(type = "info", only) {
			this.$VNotice[type]({
				...this.attrs
			});
		},
		destroy(name, istheme) {
			this.$VNotice['destroy'](name, istheme)
		},
		destroyed(name, istheme) {
			this.$VNotice['destroy']()
		}
	},
	computed: {
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
				prop: "title",
				explain: "title",
				type: "String",
				default: "-"
			},
			{
				prop: "style",
				explain: "style",
				type: "String",
				default: "-"
			},
			{
				prop: "className",
				explain: "className",
				type: "String",
				default: "-"
			},
			{
				prop: "closable",
				explain: "closable",
				type: "Boolean",
				default: "-"
			},
			// {
			// 	prop: "transitionName",
			// 	explain: "transitionName",
			// 	type: "String",
			// 	default: "-"
			// },
			{
				prop: "name",
				explain: "名称唯一id",
				type: "String",
				default: ""
			},
			{
				prop: "duration",
				explain: "duration",
				type: "Number",
				default: "3"
			},
			{
				prop: "onClose",
				explain: "回调函数",
				type: "Function",
				default: "-"
			},
			{
				prop: "render",
				explain: "显示内容",
				type: "Function",
				default: "Function:h=>{}"
			},
			{
				prop: "single",
				explain: "单一显示single，js模式",
				type: "Boolean",
				default: "-"
			},
			{
				prop: 'config|default|info|success|error|destroy|warning',
				explain: '通过直接调用以下方法来使用组件',
				type: 'Function:options',
				default: 'options',
			},
			]
		}
	},
};
</script>
