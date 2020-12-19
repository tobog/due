
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
			<vButton @click="createModal('info')">info</vButton>
			<vButton @click="createModal('success')">success</vButton>
			<vButton @click="createModal('confirm')">confirm</vButton>
			<vButton @click="createModal('default')">default</vButton>
			<vButton @click="createModal('warning')">single</vButton>
			<vButton @click="createModal('error')">error</vButton>
			<vButton @click="createModal('destroy')">destroy</vButton>
			<vModal v-model="open" v-bind="attrs">
				<p slot="header" style="color:#f60;text-align:center">
					<vIcon type="information"></vIcon>
					<span>Delete confirmation</span>
				</p>
				<div style="text-align:center;height:600px">
					<p>After this task is deleted, the downstream 10 tasks will not be implemented.</p>
					<p>Will you delete it?</p>
				</div>
				<div slot="footer">
					<vButton type="error" size="small">Delete</vButton>
				</div>
			</vModal>
		</section>
		<h2 class="title">Props & Events #</h2>
		<vTable :columns="columns" :data="data" style="width:100%" border stripe></vTable>
	</main>
</template>

<script>
export default {
	data() {
		return {
			open: true,
			switchs: {
				maskable: false,
				showHeader: true,
				showFooter: true,
				closable: true,
				transfer: true,
				dragable: true,
				fullscreen: true,
				fixed:true
			},
			selects: {
				type: 'modal',
				fullElement: 'modal',
			},
			options: {
				type: ['modal', 'drawer'],
				fullElement: ['modal', 'wrap'],
			},
			inputs: {
				delay: 6,
				content: "message",
				name: "",
				title: "title",
				width: 520,
				styles:{
					height:'300px'
				}
			},
		};

	},
	methods: {
		createModal(type) {
			this.$VModal[type]({
				render(h){return h('vSwitch',"name")},
                title: "title",
                ...this.attrs
			})
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
			return [
				{
					prop: 'name',
					explain: '对话框name，用于js调用',
					type: 'String',
					default: '-',
				},
				{
					prop: 'width',
					explain: '对话框宽度',
					type: 'Number',
					default: '520',
				},
				{
					prop: 'styles',
					explain: '对话框styles',
					type: 'Object, String',
					default: '-',
				},
				{
					prop: 'type',
					explain: '对话框类型：modal,drawer',
					type: 'String',
					default: 'modal',
				},
				{
					prop: 'fixed',
					explain: '定位头尾',
					type: 'Boolean',
					default: '-',
				},
				
				{
					prop: 'icon',
					explain: '图标',
					type: 'String',
					default: '-',
				},
				{
					prop: 'value',
					explain: '对话框是否显示，可使用 v-model 双向绑定数据。',
					type: 'Boolean',
					default: '',
				},
				{
					prop: 'title',
					explain: '对话框标题，如果使用 slot 自定义了页头，则 title 无效',
					type: 'String',
					default: '-',
				},
				{
					prop: 'maskable',
					explain: '是否允许点击遮罩层关闭',
					type: 'Boolean',
					default: '-',
				}, {
					prop: 'fullscreen',
					explain: '是否全屏显示',
					type: 'Boolean',
					default: '-',
				}, {
					prop: 'fullElement',
					explain: '全屏Element:wrap,modal',
					type: 'String',
					default: 'modal',
				}, {
					prop: 'draggable',
					explain: '是否可以拖拽移动',
					type: 'Boolean',
					default: 'false',
				}, {
					prop: 'transfer',
					explain: '是否将弹层放置于 body 内',
					type: 'Boolean',
					default: 'false',
				}, {
					prop: 'showHeader',
					explain: '显示底部Header',
					type: 'Boolean',
					default: 'true',
				}, {
					prop: 'showFooter',
					explain: '显示底部Footer',
					type: 'Boolean',
					default: 'true',
				}, {
					prop: 'delay',
					explain: '演出关闭',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'slot:title/slot/slot:footer/slot:close',
					explain: 'slot',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'delay',
					explain: '演出关闭',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'input/on-confirm/on-visible-change/on-cancel',
					explain: '事件',
					type: 'Function:val=>{}',
					default: '-',
				},
				{
					prop: 'on-after-close',
					explain: '事件',
					type: 'Function',
					default: '-',
				},
				{
					prop: 'default|info|success|warning|error|config|destroy',
					explain: '通过直接调用以下方法来使用组件',
					type: 'Function:(options,on)=>{}',
					default: 'options',
				},
			]
		}
	},
};
</script>
