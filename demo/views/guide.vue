<template>
	<div class="demo-layout padding-20">
		<h2>关于 UI-TOBOG</h2>
		<header class="padding-20">UI-TOBOG 是一套基于 Vue.js 的开源 UI 组件库，主要服务于 PC 界面的中后台产品。</header>
		<h2>安装</h2>
		<h3 class="padding-20">NPM 安装</h3>
		<div class="demo-code demo-code-other">
			<pre v-highlight>
				<code class="vue" v-text="'$ npm install ui-tobog --save'"></code>
			</pre>
			<div>或使用 &lt;script&gt;全局引用</div>
			<pre v-highlight>
				<code class="vue" v-text="'<script type=text/javascript src=ui-tobog.umd.min.js></script>'"></code>
			</pre>
		</div>
		<h2 class="padding-top-20">引入 UI-TOBOG</h2>
		<div class="demo-code demo-code-other">
			<pre v-highlight>
				<code class="vue">
import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './router.js';
import  UiTobog from 'ui-tobog';
Vue.use(VueRouter);
Vue.use(UiTobog);
// The routing configuration
const RouterConfig = {
    routes: Routers
};
const router = new VueRouter(RouterConfig);

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
				</code>
			</pre>
		</div>
		<h2 class="padding-top-20">组件使用规范</h2>
		<div class="demo-code demo-code-other">
			<pre v-highlight>
				<code class="vue">&lt;Alert :closable='true'&gt;Alert offsetBottom&lt;/Alert&gt;</code>
			</pre>
		</div>
		<h2 class="padding-top-20">全局配置</h2>
		<p class="margin-15">使用时，可以进行全局配置组件的一些属性。</p>
		<div class="demo-code demo-code-other">
			<pre v-highlight>
				<code class="vue">
Vue.use(UITOBOG, {
	compPrefix: "",//组件别名前缀
	langPrefix: 'ui',//多语言前缀,
	cssPrefix: 'ui',//css前缀,
	langMap:{
		key:"key"//多语言key映射
	}
});
				</code>
			</pre>
		</div>
		<h2 class="padding-top-20">国际化</h2>
		<p class="margin-15">所有组件文案默认使用的是中文,解耦国际化语言</p>
		<p class="margin-15">使用vue-i18n示例</p>
		<div class="demo-code demo-code-other">
			<pre v-highlight>
				<code class="vue">
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import UiTobog from 'ui-tobog';
Vue.use(UiTobog);
Vue.use(VueI18n);
new Vue({ i18n }).$mount('#app');
				</code>
			</pre>
		</div>
		<h2 class="padding-top-20">定制主题</h2>
		<p class="margin-15">默认提供了一套 UI 主题，并且可以在一定程度上定制新主题，以满足业务和品牌上的多样化视觉需求</p>
		<p class="margin-15">式是基于 Scss 进行开发的，默认以前缀 .ui- 作为命名空间，并且定义了一套样式变量，定制主题，就是编辑这个变量列表</p>
		<div class="demo-code demo-code-other">
			<div>变量覆盖（推荐）无需引入css</div>
			<pre v-highlight>
				<code class="vue">
$primary: #8c0776;
				</code>
			</pre>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			formData: {}
		};
	},

};
</script>
