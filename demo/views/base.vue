<style lang="scss" scoped>
.color-panel {
	justify-content: flex-start;
	flex-wrap: wrap;
	font-size: 16px;
	color: #fff;
	& > div {
		width: 30%;
		height: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		margin: 10px 3% 10px 0;
	}
}
</style>

<template>
	<div class="demo-layout padding-20">
		<h2>Color 色彩</h2>
		<div class="padding-20">主色</div>
		<div class="flex color-panel">
			<div v-for="(color,key) in color1" :key="key" :style="{backgroundColor:color}">
				<span>{{key}}:{{color}}</span>
			</div>
		</div>
		<div class="padding-20">辅助色：辅助色是具有代表性的颜色，常用于信息提示，比如成功、警告和失败。</div>
		<div class="flex color-panel">
			<div v-for="(color,key) in color2" :key="key" :style="{backgroundColor:color}">
				<span>{{key}}:{{color}}</span>
			</div>
		</div>
		<div class="padding-20">中性色：中性色常用于文本、背景、边框、阴影等，可以体现出页面的层次结构。</div>
		<div class="flex color-panel">
			<div v-for="(color,key) in color3" :key="key" :style="{backgroundColor:color,color:'red'}">
				<span>{{key}}:{{color}}</span>
			</div>
		</div>
		<!-- <div class="demo-code demo-code-other">
			<pre v-highlight>
				<code class="vue" v-text="'$ npm install Due --save'"></code>
			</pre>
			<div>或使用 &lt;script&gt;全局引用</div>
			<pre v-highlight>
				<code class="vue" v-text="'<script type=text/javascript src=Due.umd.min.js></script>'"></code>
			</pre>
		</div>-->
	</div>
</template>

<script>
export default {
	data() {
		return {
			color1: {
				'primary': '#2d8cf0',
				'light-primary': '#5cadff',
				'dark-primary': '#2b85e4',
			},
			color2: {
				'info': '#2db7f5',
				'success': '#19be6b',
				'warning': '#ff9900',
				'error': '#ed3f14',
				'danger': '#ed3f14',
			},
			color3: {
				'title': '#17233d',
				'content': '#515a6e',
				'sub-content': '#808695',
				'disabled': '#ebebe4',
				'border': '#dcdee2',
				'back': '#f3f3f3',
				'darkback': 'rgba(55, 55, 55, 0.92)',
				'hover': '#ebf7ff',
			}
		};
	},

};
</script>
