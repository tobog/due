
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Upload 上传)</h2>
			<h4
				class="padding-top-10"
			>文件选择上传和拖拽上传控件</h4>
		</vCol>
		<vCol span="14" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol span="10" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vUpload v-bind="formData" style="width:100%">
					<div style="padding: 30px 10px;text-align:center;">
						<vIcon type="ios-cloud-upload" size="36" style="color: #3399ff"></vIcon>
						<p>upload</p>
					</div>
				</vUpload>
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
			datalist: [],
			value: []
		};
	},

	computed: {
		getCode() {
			return `
					<vUpload v-bind="${this.getCodeString(this.formData)}"  style="width:100%">
						<div style="padding: 30px 10px;text-align:center;">
							<vIcon type="ios-cloud-upload" size="36" style="color: #3399ff"></vIcon>
							<p>upload</p>
						</div>
					</vUpload>`;
		},
		getBase() {
			return [
				{
					label: "手动开始",
					key: "manual",
					tag: "vSwitch",
					default: true
				},
				{
					label: "拖放",
					key: "draggable",
					tag: "vSwitch",
					default: true
				},
				{
					label: "多文件",
					key: "multiple",
					tag: "vSwitch",
					default: false
				},
				{
					label: "自动上传",
					key: "sync",
					tag: "vSwitch",
					default: false
				},
				{
					label: "进度",
					key: "progress",
					tag: "vSwitch",
					default: true
				},
				{
					label: "切片大小",
					key: "piece",
					tag: "vInputNumber",
					// default: false
				},
				{
					label: "最大文件",
					key: "maxSize",
					tag: "vInputNumber",
					// default: false
				},
				{
					label: "并发数目",
					key: "threads",
					tag: "vInputNumber",
					// default: false
				},


			];
		},
		compProps() {
			return [
				{
					prop: "name",
					explain: "input的name,用于隐藏域，上传的文件字段名",
					type: "String",
					default: "-"
				},
				{
					prop: "action",
					explain: "上传的地址",
					type: "String",
					default: "-"
				},
				{
					prop: "draggable",
					explain: "是否支持拖拽",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "multiple",
					explain: "是否支持多文件上传",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "progress",
					explain: "是否显示进度过程",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "threads",
					explain: "并发数目",
					type: "Number",
					default: "-"
				},
				{
					prop: "piece",
					explain: "切片文件大小限制 单位 kb",
					type: "Number",
					default: "-"
				},
				{
					prop: "manual",
					explain: "是否支持手动上传，调用manualUpload函数",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "with-credentials",
					explain: "支持发送 cookie 凭证信息",
					type: "Boolean",
					default: "false"
				},
				{
					prop: "sync",
					explain: "同步上传，避免出现文件过多，阻塞进行",
					type: "Boolean, Number, String",
					default: "-"
				},
				{
					prop: "params",
					explain: "上传时附带的额外参数",
					type: "Object",
					default: "-"
				},
				{
					prop: "headers",
					explain: "设置上传的请求头部",
					type: "Object",
					default: "-"
				},
				{
					prop: "format",
					explain: "指定文件格式",
					type: "Array",
					default: "-"
				},
				{
					prop: "accept",
					explain: "接受上传的文件类型",
					type: "String",
					default: "-"
				},
				{
					prop: "maxSize",
					explain: "文件大小限制 单位 kb",
					type: "Number, String",
					default: "-"
				},
				{
					prop: "beforeUpload",
					explain: "上传文件之前的钩子",
					type: "Function",
					default: "-"
				},
				{
					prop: "progress",
					explain: "progress变化",
					type: "Function",
					default: "event,file，filelist"
				},
				{
					prop: "success",
					explain: "success变化",
					type: "Function",
					default: "res,file，filelist"
				},
				{
					prop: "error",
					explain: "error变化",
					type: "Function",
					default: "res,file，filelist"
				},
				{
					prop: "remove",
					explain: "remove变化",
					type: "Function",
					default: "file，filelist"
				},
				{
					prop: "preview",
					explain: "preview变化",
					type: "Function",
					default: "file，filelist"
				},
				{
					prop: "on-filter-error",
					explain: "on-filter-error变化",
					type: "Function",
					default: "file，type,filelist"
				}
			];
		}
	}
};
</script>
