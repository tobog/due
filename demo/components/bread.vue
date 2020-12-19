
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Breadcrumb 面包屑)</h2>
			<h4 class="padding-top-10">显示网站的层级结构，告知用户当前所在位置，以及在需要向上级导航时使用。</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="10" span="24" class="demo-view">
			<div>
				<vSwitch v-model="show" class="margin-bottom-10">
					<span slot="open">开</span>
					<span slot="close">关</span>
				</vSwitch>
			</div>
			<vBread v-if="show" v-bind="formData">
				<vBreadItem href="/">
					<vIcon type="ios-home-outline"></vIcon>
				</vBreadItem>
				<vBreadItem href="/">
					<vIcon type="ios-home-outline"></vIcon>Home
				</vBreadItem>
				<vBreadItem to="/bread">
					<vIcon type="social-buffer-outline"></vIcon>Components
				</vBreadItem>
				<vBreadItem>
					<vIcon type="pound"></vIcon>vBread
				</vBreadItem>
				
			</vBread>
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
	computed: {
		getCode() {
			return `<vBread v-bind='${this.getCodeString(this.formData)}'>
                        <vBreadItem href='/'>
                            <vIcon type='ios-home-outline'></vIcon>Home
                        </vBreadItem>
                        <vBreadItem to='/bread'>
                            <vIcon type='social-buffer-outline'></vIcon>Components
                        </vBreadItem>
                        <vBreadItem>
                            <vIcon type='pound'></vIcon>vBread
                        </vBreadItem>
                    </vBread>`
		},
		getBase() {
			return [
				{
					label: "分隔符",
					key: "sep",
					default: '/'
				},
				{
					label: "链接",
					key: "to",
					// default: ''
				},
				{
					label: "链接",
					key: "href",
					// default: ''
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'BreadItem|Bread:sep',
					explain: 'separator:自定义分隔符分隔符',
					type: 'String | Element String',
					default: '/',
				},
				{
					prop: 'BreadItem:to',
					explain: '链接，不传则没有链接，支持 vue-router 对象',
					type: 'String | Object',
					default: '-',
				},
				{
					prop: 'BreadItem:href',
					explain: 'a:链接',
					type: 'String',
					default: '',
				},
				{
					prop: 'BreadItem:tag',
					explain: 'to:router-link,href:a',
					type: 'String',
					default: 'span',
				},
				{
					prop: 'BreadItem:$attrs',
					explain: 'BreadItem:继承属性，target,tag...',
					type: 'object',
					default: '-',
				},
			];
		}
	},
};
</script>
