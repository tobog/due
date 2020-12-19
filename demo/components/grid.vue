
<style lang="scss">
.demo-row {
	margin-bottom: 5px;
	background-image: linear-gradient(
		90deg,
		#f5f5f5 50%,
		transparent 0,
		transparent 100%
	);
	background-size: 8.333333333333334% 100%;
}
.demo-col {
	color: #fff;
	padding: 30px 0;
	text-align: center;
	font-size: 18px;
	background: rgba(0, 153, 229, 0.3);
}
.demo-col:nth-child(2n) {
	background: rgba(0, 153, 229, 0.7);
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Grid 栅格)</h2>
			<h4 class="padding-top-10">
				<ul>
					<li>我们采用了24栅格系统，将区域进行24等分，这样可以轻松应对大部分布局问题。使用栅格系统进行网页布局，可以使页面排版美观、舒适。</li>
					<li>我们定义了两个概念，行row和列col，具体使用方法如下：</li>
					<li>使用row在水平方向创建一行</li>
					<li>将一组col插入在row中</li>
					<li>在每个col中，键入自己的内容</li>
					<li>通过设置col的span参数，指定跨越的范围，其范围是1到24</li>
					<li>每个row中的col总和应该为24</li>
				</ul>
			</h4>
		</vCol>
		<vCol lg="24" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="24" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vRow
					class="demo-row"
					v-bind="formData"
					:style="{'background-size':(100/(formData.grid||1))+'%'+' 100%'}"
				>
					<vCol class="demo-col" :xs="8" :sm="6" :md="6" :lg="4">xs=8 sm=6 md=6 lg=4</vCol>
					<vCol class="demo-col" :xs="4" :sm="6" :md="3" :lg="8">xs=4 sm=6 md=3 lg=8</vCol>
					<vCol class="demo-col" span="6" offset="8">col-6 | offset-8</vCol>
					<vCol class="demo-col" span="6" offset="4">col-6 | offset-4</vCol>
				</vRow>
				<vRow class="demo-row">
					<vCol class="demo-col" span="18" push="6">col-18 | push-6</vCol>
					<vCol class="demo-col" span="6" pull="18">col-6 | pull-18</vCol>
				</vRow>
				<vRow class="demo-row" v-bind="formData">
					<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
						<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
					</vCol>
					<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
						<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
					</vCol>
					<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
						<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
					</vCol>
					<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
						<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
					</vCol>
				</vRow>
			</section>
		</vCol>
		<!-- <vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
		</vCol>-->
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
			value: "",
		};
	},
	computed: {
		getCode() {
			return `<vRow class="demo-row" v-bind="formData">
						<vCol class="demo-col" :xs="8" :sm="6" :md="6" :lg="4">xs=8 sm=6 md=6 lg=4</vCol>
						<vCol class="demo-col" :xs="4" :sm="6" :md="3" :lg="8">xs=4 sm=6 md=3 lg=8</vCol>
						<vCol class="demo-col" span="6" offset="8">col-6 | offset-8</vCol>
						<vCol class="demo-col" span="6" offset="4">col-6 | offset-4</vCol>
					</vRow>
					<vRow class="demo-row">
						<vCol class="demo-col" span="18" push="6">col-18 | push-6</vCol>
						<vCol class="demo-col" span="6" pull="18">col-6 | pull-18</vCol>
					</vRow>
					<vRow class="demo-row" v-bind="formData">
						<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
							<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
						</vCol>
						<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
							<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
						</vCol>
						<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
							<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
						</vCol>
						<vCol span="6" :xs="2" :sm="4" :md="6" :lg="8">
							<div class="demo-col">span=6 xs=2 sm=4 md=6 lg=8</div>
						</vCol>
					</vRow>
							`;
		},
		getBase() {
			return [
				{
					label: "是否flex布局",
					key: "flex",
					tag: "vSwitch",
					default: true
				},
				{
					label: "栅格基数",
					key: "grid",
					tag: "vInputNumber",
					default: 24
				},
				{
					label: "栅格间距",
					key: "gutter",
					tag: "vInputNumber",
					default: 0
				},
				{
					label: "flex垂直对齐",
					key: "align",
					tag: "vSelect",
					default: '',
					options: ['top', 'middle', 'bottom', 'stretch']
				},
				{
					label: "flex水平排列",
					key: "justify",
					tag: "vSelect",
					default: '',
					options: ['start', 'center', 'end', 'space-around', 'space-between']
				},

			];
		},
		compProps() {
			return [
				{
					prop: 'Row:flex',
					explain: '是否flex布局',
					type: 'Boolean',
					default: false,
				},
				{
					explain: "flex 布局下的垂直对齐方式，可选值为top、middle、bottom,stretch",
					prop: "flex:align",
					type: "String",
					default: '',
				},
				{
					explain: "flex 布局下的水平排列方式，可选值为start、end、center、space-around、space-between",
					prop: "flex:justify",
					type: "String",
					default: '',
				},
				{
					prop: 'Row:grid',
					explain: 'Row:总栅格数',
					type: 'Number',
					default: '24',
				},
				{
					prop: 'Row:gutter',
					explain: 'Row:栅格间距，单位 px，左右平分',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:span',
					explain: '栅格的占位格数，可选值为0~grid的整数，为 0 时，相当于display:none',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:offset',
					explain: '栅格左侧的间隔格数，间隔内不可以有栅格',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:push',
					explain: '栅格向右移动格数',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:gutter',
					explain: '栅格间距，单位 px，左右平分',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:pull',
					explain: '栅格向左移动格数',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:order',
					explain: '栅格的顺序，在flex布局模式下有效',
					type: 'Number',
					default: '-',
				},
				{
					prop: 'Col:xs',
					explain: '	<768px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},
				{
					prop: 'Col:xs',
					explain: '	≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},
				{
					prop: 'Col:md',
					explain: '	≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},
				{
					prop: 'Col:lg',
					explain: '	≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},

			];
		}
	}
};
</script>
