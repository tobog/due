
<style lang="scss">
.demo-vcarousel {
	width: 100%;
	min-height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-size: 20px;
	background: #506b9e;
}
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Carousel 走马灯)</h2>
			<h4 class="padding-top-10">常用于一组图片或卡片轮播，当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。</h4>
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
				<vCarousel v-model="val" v-bind="formData">
					<vCarouselItem>
						<div class="demo-vcarousel">1</div>
					</vCarouselItem>
					<vCarouselItem>
						<div class="demo-vcarousel">2</div>
					</vCarouselItem>
					<vCarouselItem>
						<div class="demo-vcarousel">3</div>
					</vCarouselItem>
					<vCarouselItem>
						<div class="demo-vcarousel">4</div>
					</vCarouselItem>
					<vCarouselItem>
						<div class="demo-vcarousel">5</div>
					</vCarouselItem>
				</vCarousel>
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
			val: 0
		}
	},
	computed: {
		getCode() {
			return `<vCarousel v-model="val" v-bind="${this.getCodeString(this.formData)}">
						<vCarouselItem>
							<div class="demo-vcarousel">1</div>
						</vCarouselItem>
						<vCarouselItem>
							<div class="demo-vcarousel">2</div>
						</vCarouselItem>
						<vCarouselItem>
							<div class="demo-vcarousel">3</div>
						</vCarouselItem>
						<vCarouselItem>
							<div class="demo-vcarousel">4</div>
						</vCarouselItem>
						<vCarouselItem>
							<div class="demo-vcarousel">5</div>
						</vCarouselItem>
					</vCarousel>`
		},
		getBase() {
			return [
				{
					label: "反向",
					key: "reverse",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "自动播放",
					key: "autoplay",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "循环",
					key: "loop",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "间隔时间",
					key: "interval",
					tag: "vInputNumber",
					default: 1000,
				},
				{
					label: "模式",
					key: "modal",
					tag: "vSelect",
					default: 'carousel',
					options: ['carousel', 'fade'],
				},
				{
					label: "左右箭头",
					key: "arrow",
					tag: "vSelect",
					options: ['hover', 'always', 'never'],
					default: 'always',
				},
				{
					label: "圆形指示器",
					key: "radiusDot",
					tag: "vSwitch",
					default: false,
				},
				{
					label: "指示器的位置",
					key: "dots",
					tag: "vSelect",
					default: "inside",
					options: ['inside', 'outside', 'none'],
				},
				{
					label: "指示器触发方式",
					key: "trigger",
					tag: "vSelect",
					default: "click",
					options: ['click', 'hover'],
				},

			];
		},
		compProps() {
			return [
				{
					prop: 'value',
					explain: '幻灯片的索引，从 0 开始，可以使用 v-model 双向绑定数据',
					type: 'Number',
					default: '0',
				},
				{
					prop: 'reverse',
					explain: '是否反向',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'autoplay',
					explain: '自动播放',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'loop',
					explain: '是否开启循环',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'interval',
					explain: '间隔时间',
					type: 'Boolean',
					default: '1000',
				},
				{
					prop: 'modal',
					explain: '模式:carousel, fade',
					type: 'Boolean',
					default: 'carousel',
				},
				{
					prop: 'arrow',
					explain: '切换箭头的显示时机，可选值为 hover（悬停），always（一直显示），never（不显示）',
					type: 'String',
					default: 'always',
				},
				{
					prop: 'radiusDot',
					explain: '圆形指示器',
					type: 'Boolean',
					default: 'false',
				},
				{
					prop: 'dots',
					explain: '指示器的位置，可选值为 inside （内部），outside（外部），none（不显示）',
					type: 'String',
					default: 'inside',
				},
				{
					prop: 'trigger',
					explain: '指示器的触发方式，可选值为 click（点击），hover（悬停）',
					type: 'String',
					default: 'click',
				},
				{
					prop: 'on-change',
					explain: '幻灯片切换时触发，目前激活的幻灯片的索引，原幻灯片的索引',
					type: 'Function:Event',
					default: '(oldValue, value)=>{}',
				},
			];
		}
	},
};
</script>
