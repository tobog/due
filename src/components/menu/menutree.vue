<template>
	<Menu
		:multiple="multiple"
		:always="always"
		:theme="theme"
		:mode="mode"
		@on-open-change="handleOpen"
		@on-select="handleSelect"
	>
		<MenuNode
			v-for="(child, index) in getRootNodeList"
			:ref="index"
			:key="child.linkIndex"
			:node="child"
			:always="always"
			:mode="mode"
		></MenuNode>
	</Menu>
</template>

<script>
import Menu from './menu';
import MenuNode from './menunode';
import linkListMixin from "../../mixins/linkList";
export default {
	name: "MenuTree",
	mixins: [linkListMixin],
	provide() {
		return { '$RootInstance': this };
	},
	components: {
		Menu,
		MenuNode
	},
	props: {
		render: Function,
		multiple: Boolean,
		always: Boolean,
		mode: {
			type: String,
			// default: "vertical"//horizontal,vertical
		},
		theme: {
			type: String,
			// default: 'primary'//primary,dark,light
		},
	},
	data() {
		return {

		};
	},
	created() {
		this.initData();
	},
	watch: {
		data: {
			deep: true,
			handler(val) {
				this.initData();
			}
		}
	},
	methods: {
		handleOpen(name, isopen) {
			this.$emit('on-open-change', name, isopen);
		},
		handleSelect(name) {
			this.$emit('on-select', name);
		},
		initData() {
			const headNodeList = this.getHeadNodes();
			const nodeList = (this.nodeList = this.handleNodeList(
				headNodeList
			));
			const len = nodeList.length;
			this.rootNode = this.initRootNode(headNodeList.length);
		},
	}
};
</script>