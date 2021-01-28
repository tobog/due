
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Modal 对话框)</h2>
			<h4 class="padding-top-10">
				<div>模态对话框，在浮层中显示，引导用户进行相关操作。</div>
				<div>Modal提供了两种用法，普通组件使用和封装好的简洁实例调用。</div>
			</h4>
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
				<vButton @click="val=!val">toggle</vButton>
				<vButton @click="handleModal('info')">info</vButton>
				<vButton @click="handleModal('success')">success</vButton>
				<vButton @click="handleModal('confirm')">confirm</vButton>
				<vButton @click="handleModal('default')">default</vButton>
				<vButton @click="handleModal('warning')">warning</vButton>
				<vButton @click="handleModal('error')">error</vButton>
				<vButton @click="handleModal('destroy')">destroy</vButton>
				<vButton @click="val=true">destroy</vButton>
				<vModal v-bind="formData" v-model="val">
					<vModal  v-model="val1">destroy</vModal>
				</vModal>
			</section>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">通过直接调用以下方法来使用组件：</h2>
			<div class="color-warn padding-5">this.$Modal.default(props, on )</div>
			<div class="color-warn padding-5">this.$Modal.info(props, on)</div>
			<div class="color-warn padding-5">this.$Modal.success(props, on)</div>
			<div class="color-warn padding-5">this.$Modal.warning(props, on)</div>
			<div class="color-warn padding-5">this.$Modal.error(props, on)</div>
			<div class="color-warn padding-5">this.$Modal.loading(immediate)</div>
			<div class="color-warn padding-5">this.$Modal.config(config,isVmOptions)</div>
			<div class="color-warn padding-5">this.$Modal.destroy(name)</div>
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
			val: true,
			val1:true
		};
	},
	computed: {
		getCode() {
			return `<vButton @click="handleModal('info')">info</vButton>
					<vButton @click="handleModal('success')">success</vButton>
					<vButton @click="handleModal('confirm')">confirm</vButton>
					<vButton @click="handleModal('default')">default</vButton>
					<vButton @click="handleModal('warning')">single</vButton>
					<vButton @click="handleModal('error')">error</vButton>
					<vButton @click="handleModal('destroy')">destroy</vButton>
					<vModal v-bind="${this.getCodeString(this.formData)}" v-model="val">destroy</vModal>
					<vButton @click="val=!val">toggle</vButton>
					<script>
					function handleModal(type) {
						this.$VModal[type](this.formData)
					}
					\<\/script>
					`;
		},
		getBase() {
			return [
				{
					label: "显示标题",
					key: "showHeader",
					tag: "vSwitch",
					default: true,
				},
				{
					label: "显示尾部",
					key: "showFooter",
					tag: "vSwitch",
					default: true,
				},
				{
					label: "遮罩",
					key: "maskable",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "关闭按钮",
					key: "closable",
					tag: "vSwitch",
					default: true
				},
				{
					label: "置于body内",
					key: "transfer",
					tag: "vSwitch",
					default: false
				},
				{
					label: "拖拽移动",
					key: "dragable",
					tag: "vSwitch",
					default: false
				},
				{
					label: "全屏",
					key: "fullscreen",
					tag: "vSwitch",
					default: true
				},
				{
					label: "全局覆盖锁定屏幕的滚动",
					key: "lock",
					tag: "vSwitch",
					default: true
				},
				{
					label: "定位",
					key: "fixed",
					tag: "vSwitch",
					default: false
				},

				{
					label: "是否异步操作",
					key: "async",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "敏捷模式",
					key: "prompt",
					tag: "vSelect",
					default: '',
					options: ['info', 'confirm', 'success', 'warning', 'error', 'default']
				},
				{
					label: "模态类型",
					key: "type",
					tag: "vSelect",
					default: "modal",
					options: ['modal', 'drawer']
				},
				{
					label: "全屏元素",
					key: "fullElement",
					tag: "vSelect",
					default: "modal",
					options: ['modal', 'wrap']
				},
				{
					label: "对话框标题",
					key: "title",
					tag: "vInput",
					default: "message",
				},
				{
					label: "延迟关闭",
					key: "delay",
					tag: "vInputNumber",
					default: 0,
				},
				{
					label: "对话框宽度",
					key: "width",
					tag: "vInputNumber",
					default: 520,
				},
				{
					label: "modal的样式",
					key: "modalStyle",
					tag: "vTextarea",
					default: '',
				},
				{
					label: "内容",
					key: "content",
					tag: "vTextarea",
					default: "message",
				},

			];
		},
		compProps() {
			return [
				{
					prop: 'name',
					explain: '对话框name，用于js调用',
					type: 'String',
					default: '-',
				},
				{
					prop: 'visible',
					explain: '对话框是否显示，可使用 v-model 双向绑定数据。',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'width',
					explain: '对话框宽度',
					type: 'Number',
					default: '520',
				},
				{
					prop: 'position',
					explain: '自定义位置:[top, right, bottom, left]',
					type: 'Array:[top, right, bottom, left]',
					default: '',
				},
				{
					prop: 'modalStyle',
					explain: '自定义对话框的样式',
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
					default: 'false',
				},
				{
					explain: "关闭按钮",
					prop: "closable",
					type: "Boolean",
					default: 'true'
				},
				{
					explain: "是否可以拖拽移动",
					prop: "dragable",
					type: "Boolean",
					default: 'false'
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
					default: false,
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
					explain: '延迟关闭',
					type: 'Number',
					default: '0',
				},
				{
					explain: "自定义定位,仅在type=modal：[top,right,bottom,left]",
					prop: "position",
					type: "Array",
					default: '-',
				},
				{
					prop: 'slot:title',
					explain: '自定义页头',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:footer',
					explain: '自定义页脚内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:close',
					explain: '自定义右上角关闭内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'slot:default',
					explain: '自定义主体内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'on-fullscreenchange',
					explain: '全屏事件',
					type: 'Function:Event',
					default: '(boolean)=>{}',
				},
				{
					prop: 'on-cancel',
					explain: '点击取消的回调',
					type: 'Function:Event',
					default: '(name)=>{}',
				},
				{
					prop: 'on-after-close',
					explain: '在关闭之后触发',
					type: 'Function:Event',
					default: '(name)=>{}',
				},
				{
					prop: 'on-confirm',
					explain: '	点击确定的回调',
					type: 'Function:Event',
					default: '(name)=>{}',
				},
				{
					prop: 'on-visible-change',
					explain: '显示状态发生变化时触发',
					type: 'Function:val=>{}',
					default: '(val,name)=>{}',
				},
				{
					prop: 'on-after-close',
					explain: '事件',
					type: 'Function',
					default: '-',
				},
				{
					prop: 'JS:default|info|success|warning|error|config|destroy',
					explain: '通过直接调用以下方法来使用组件',
					type: 'Function:(options,on)=>{}',
					default: 'options',
				},
				{
					prop: 'JS:render',
					explain: '事件',
					type: 'Function',
					default: '-',
				}
			];
		}
	},
	methods: {
		handleModal(type) {
			this.$VModal[type](this.formData)
		}
	},
};
</script>
