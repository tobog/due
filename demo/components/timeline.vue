
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Timeline 时间轴)</h2>
			<div>对一系列信息进行时间排序时，垂直地展示。</div>
		</vCol>
		<vCol span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vTimeline v-bind="formData">
					<vTimelineItem>
						<vIcon type="ios-trophy" slot="dot" size="26"></vIcon>
						<p class="time">1976年</p>
						<p class="content">Apple I 问世</p>
					</vTimelineItem>
					<vTimelineItem theme="error">
						<p class="time">1984年</p>
						<p class="content">发布 Macintosh</p>
					</vTimelineItem>
					<vTimelineItem theme="success">
						<p class="time">2007年</p>
						<p class="content">发布 iPhone</p>
					</vTimelineItem>
					<vTimelineItem theme="warning">
						<p class="time">2010年</p>
						<p class="content">发布 iPad</p>
					</vTimelineItem>
					<vTimelineItem>
						<p class="time">2011年10月5日</p>
						<p class="content">史蒂夫·乔布斯去世</p>
					</vTimelineItem>
				</vTimeline>
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
			val: '',

		};
	},
	computed: {
		getCode() {
			return ` <vTimeline v-bind="${this.getCodeString(this.formData)}">
						<vTimelineItem>
							<vIcon type="ios-trophy" slot="dot" size="26"></vIcon>
							<p class="time">1976年</p>
							<p class="content">Apple I 问世</p>
						</vTimelineItem>
						<vTimelineItem theme="error">
							<p class="time">1984年</p>
							<p class="content">发布 Macintosh</p>
						</vTimelineItem>
						<vTimelineItem theme="success">
							<p class="time">2007年</p>
							<p class="content">发布 iPhone</p>
						</vTimelineItem>
						<vTimelineItem theme="warning">
							<p class="time">2010年</p>
							<p class="content">发布 iPad</p>
						</vTimelineItem>
						<vTimelineItem>
							<p class="time">2011年10月5日</p>
							<p class="content">史蒂夫·乔布斯去世</p>
						</vTimelineItem>
					</vTimeline>`;
		},
		getBase() {
			return [
				{
					label: "幽灵节点",
					key: "pending",
					tag: "vSwitch",
					default: false
				},
				{
					label: "模式",
					key: "mode",
					tag: "vSelect",
					default: 'vertical',
					options: ['vertical', 'horizontal']
				},
			];
		},
		compProps() {
			return [
				{
					prop: 'pending',
					explain: '指定是否最后一个节点为幽灵节点',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'mode',
					explain: '模式，可选值为vertical,horizontal ',
					type: 'String',
					default: 'vertical',
				},
				{
					prop: 'TimelineItem :theme',
					explain: '圆圈颜色，可选值为 confirm、gray、success, primary,warning,error,info',
					type: 'String',
					default: 'primary',
				},
				{
					prop: 'TimelineItem :color',
					explain: '圆圈颜色，自定义色值',
					type: 'String',
					default: '-',
				},
				{
					prop: 'TimelineItem :default',
					explain: '	基本内容',
					type: 'VNode',
					default: '-',
				},
				{
					prop: 'TimelineItem :dot',
					explain: '自定义时间轴点内容',
					type: 'VNode',
					default: '-',
				},

			];
		}
	}
};
</script>
