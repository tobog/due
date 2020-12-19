

<template>
	<main style="padding:20px 0;" class="examples-main">
		<section class="clearfix">
			<aside class="example">
				<div style="padding:10px 0;">参数：</div>
				<div style="height:60%">
					<vForm style="padding-top:10px;" label-width="100">
						<vFormItem label="draggable">
							<vSwitch v-model="attrs.draggable"></vSwitch>
						</vFormItem>
						<vFormItem label="multiple">
							<vSwitch v-model="attrs.multiple"></vSwitch>
						</vFormItem>
						<vFormItem label="progress">
							<vSwitch v-model="attrs.progress"></vSwitch>
						</vFormItem>
						<vFormItem label="manual">
							<vSwitch v-model="attrs.manual"></vSwitch>
						</vFormItem>
						<vFormItem label="sync">
							<vSwitch v-model="attrs.sync"></vSwitch>
						</vFormItem>
						<vFormItem label="accept">
							<vInput v-model="attrs.accept"/>
						</vFormItem>
						<vFormItem label="maxSize">
							<vInput v-model="attrs.maxSize" type="number"/>
						</vFormItem>
						<vFormItem label="format">
							<vSelect v-model="attrs.format" multiple>
								<vOption value="tree"></vOption>
								<vOption value="loop"></vOption>
								<vOption value="heart-outline"></vOption>
								<vOption value="plus-empty"></vOption>
							</vSelect>
						</vFormItem>
					</vForm>
				</div>
			</aside>

			<aside class="example">
				<div style="height:90%;">
					<div style="padding:10px 0;">编辑参数：</div>
					<pre>{{attrs}}</pre>
				</div>
			</aside>

			<section class="example">
				<div style="padding:10px 0;">视图：</div>
				<vUpload v-bind="attrs" ref="vUpload" style="width:100%">
					<vButton>vUpload</vButton>
				</vUpload>
			</section>
		</section>
	</main>
</template>

<script>
export default {
	methods: {

	},
	data() {
		return {
			val: false,


			attrs: {
				action: 'http://localhost:8088/api/upload',
				headers: {},
				params: {},
				name: 'file',
				draggable: true,
				multiple: true,
				progress: true,
				manual: true,
				sync: true,
				format: [],
				accept: '*',
				maxSize: '',
				defaultFileList: [
					{
						name: 'img1.jpg',
						url: 'http://www.xxx.com/img1.jpg',
					},
					{
						name: 'img2.jpg',
						url: 'http://www.xxx.com/img2.jpg',
					},
				],
			},
			columns: [
				{
					title: '属性/事件/方法',
					key: 'prop',
				},
				{
					title: '说明',
					key: 'explain',
				},
				{
					title: '类型',
					key: 'type',
				},
				{
					title: '默认值/参数/返回值',
					key: 'default',
				},
			],
			props: [
				{
					prop: 'name',
					explain: 'input的name,用于隐藏域',
					type: 'String',
					default: '-',
				},
				{
					prop: 'draggable',
					explain: '是否支持拖拽',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'multiple',
					explain: '是否支持多文件上传',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'progress',
					explain: '是否显示进度过程',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'manual',
					explain: '是否支持手动上传，调用manualUpload函数',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'sync',
					explain: '同步上传，避免出现文件过多，阻塞进行',
					type: 'Boolean, Number, String',
					default: '-',
				},
				{
					prop: 'format',
					explain: '指定文件格式',
					type: 'Array',
					default: '-',
				},
				{
					prop: 'accept',
					explain: '指定文件',
					type: 'String',
					default: '-',
				},
				{
					prop: 'maxSize',
					explain: '过滤文件大小',
					type: 'Number, String',
					default: '-',
				},
				{
					prop: 'beforeUpload',
					explain: 'beforeUpload',
					type: 'Function',
					default: '-',
				},
			],
			event: [
				{
					prop: 'progress',
					explain: 'progress变化',
					type: 'Function',
					default: 'event,file，filelist',
				},
				{
					prop: 'success',
					explain: 'success变化',
					type: 'Function',
					default: 'res,file，filelist',
				},
				{
					prop: 'error',
					explain: 'error变化',
					type: 'Function',
					default: 'res,file，filelist',
				},
				{
					prop: 'remove',
					explain: 'remove变化',
					type: 'Function',
					default: 'file，filelist',
				},
				{
					prop: 'preview',
					explain: 'preview变化',
					type: 'Function',
					default: 'file，filelist',
				},
				{
					prop: 'on-filter-error',
					explain: 'on-filter-error变化',
					type: 'Function',
					default: 'file，type,filelist',
				},
			],
		};
	},
};
</script>
