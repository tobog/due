
<style lang="scss">
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Drop 下拉组件)</h2>
			<h4 class="padding-top-10">提供下拉Drop。</h4>
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
				<vButton @click="value=!value" ref="btn">vDrop</vButton>
				<vDrop
					v-show="value"
					:reference="($refs.btn||{}).$el"
					v-bind="formData"
					style="height:100px;overflow:auto;line-height:2"
				>
					<div style="width:100px;">111111</div>
					<div>2222</div>
				</vDrop>
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
			value: false
		};
	},
	computed: {
		getCode() {
			return `<vButton @click="value=!value" ref="btn">vButton</vButton>
					<vDrop
						:reference="($refs.btn||{}).$el"
						v-bind="${this.getCodeString(this.formData)}"
						style="height:100px;overflow:auto;line-height:2">
						<div style="width:100px;">111111</div>
						<div>2222</div>
					</vDrop>
						`;
		},
		getBase() {
			return [
				{
					label: "放置body下",
					key: "transfer",
					tag: "vSwitch",
					default: false
				},
				{
					label: "动画名称",
					key: "transition",
					tag: "vInput",
					default: "transition-drop"
				},
				{
					label: "Drop组件配置",
					key: "options",
					tag: "vInput",
					default: "-"
				},
			];
		},
		compProps() {
			return [
				{
					explain: "放置body下",
					prop: "transfer",
					type: Boolean,
					default: false
				},
				{
					explain: "动画名称",
					prop: "transition",
					type: String,
					default: "transition-drop"
				},
				{
					explain: "相对索引Element",
					prop: "reference",
					type: HTMLElement,
					default: "-"
				},
				{
					explain: "Drop组件配置：默认来自$attrs",
					prop: "options",
					tag: "vInput",
					default: "-"
				},
				{
					prop: "$listeners",
					explain: "继承所有事件",
					type: "-",
					default: "-"
				},
			];
		}
	}
};
</script>
