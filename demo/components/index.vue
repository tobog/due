<style scoped>
.examples-menu {
	position: fixed;
	left: 0;
	top: 0;
	padding-top: 60px;
	width: 200px;
	height: 100%;
	overflow: auto;
}
.examples-content {
	padding-left: 230px;
	box-sizing: border-box;
	width: 100%;
}
.search-menu {
	position: fixed;
	left: 20px;
	top: 10px;
	width: 160px;
	z-index: 100;
}
</style>

<template>
    <div class="examples-content">
		<div class="search-menu">
			<vInput v-model="val"  autotip @change="initMenu">
				<vOption v-for="option in options" :value='option' :key='option'></vOption>
			</vInput>
		</div>
		<vTree :data="meun"  class="examples-menu" type='menu' theme='dark' ref="vtree"/>
        <transition name="fade">
            <router-view/>
			更多组件正在开发更新中
        </transition>
    </div>
</template>

<script>
import './index.scss';
import initList from '../router/routelist'
export default {
	name: 'App',

	watch: {
		val(val) {
			if (!val) {
				this.options = [];
				return;
			}
			this.options = this.$refs.vtree.linkedList
				.filter(child => {
					const node = child.node;
					if (node.title.indexOf(val) > -1) {
						return true;
					}
				})
				.map(child => {
					const node = child.node;
					return node.title;
				});
		},
	},
	data() {
		return {
			val: '',
			options: [],
			meun:initList(),
		};
	},
	methods: {
		initMenu(event) {
			if (this._isMounted) {
				this.$refs.vtree.initStatus('title', event.target.value);
			}
		},
	},
};
</script>
