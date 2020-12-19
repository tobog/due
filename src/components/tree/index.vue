<template>
	<ul :class="wrapClasses" :key="type">
		<Cell
			v-for="(child, index) in getRootNodeList"
			:ref="index"
			:key="child.linkIndex"
			:draggable="draggable"
			:dragTip="dragTip"
			:selection="selection"
			:type="type"
			:node="child"
			:isTransverse="isTransverse"
			:multiple="multiple"
			:always="always"
			:indent="indent"
			:expandStatus="expandStatus"
			:activeIndex="activeIndex"
		>
			<slot></slot>
		</Cell>
		<Tooltip
			v-if="getDragPopper && reference && popperTip"
			:reference="reference"
			:theme="theme || 'drak'"
			always
			gpu
			placement="top-center"
			offset="10"
		>
			<div slot="content" style="padding-top:3px">{{ popperTip }}</div>
		</Tooltip>
	</ul>
</template>

<script>
import linkListMixin from "../../mixins/linkList";
import Cell from "./node";
import Tooltip from "../tooltip/index";
import { validVal } from "../../utils/tool";

export default {
	name: "Tree",
	mixins: [linkListMixin],
	provide() {
		return { "$RootTreeInstance": this };
	},
	components: { Cell, Tooltip },
	props: {
		draggable: Boolean,
		render: Function,
		selection: Boolean,
		multiple: Boolean,
		always: Boolean,
		type: {
			type: String,
			// validator(value) {
			// 	return oneOf(value, ['tree', 'menu']);
			// },
			default: "tree"
		},
		theme: {
			type: String
			// default: 'primary',
		},
		isTransverse: {
			type: Boolean,
			default: false
		},
		dragTip: {
			type: String,
			default: "line" //line,popper,all,none
		},
		indent: {
			type: Boolean,
			default: true
		},
		selectOnlySelf: {
			type: Boolean,
			default: false
		},
		toggleActive: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			expandStatus: [],
			reference: null,
			popperTip: null,
			activeIndex: '',
		};
	},
	created() {
		this.$on("on-check", this.handleCheck);
		this.$on("on-drop", this.handleDrop);
		this.$on("on-expand", this.updateExpand);
		this.$on("on-dragDrop", this.handleDragDrop);
		this.$on("on-dropTip", this.handleDropTip);
		this.$on('on-active', this.updateActive);
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
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.type}`]: !!this.type,
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-transverse`]: this.isTransverse
				}
			];
		},
		getDragPopper() {
			return (
				this.draggable &&
				(this.dragTip === "all" || this.dragTip === "popper")
			);
		},
		getDragLine() {
			return (
				this.draggable &&
				(this.dragTip === "all" || this.dragTip === "line")
			);
		}
	},
	methods: {
		initData() {
			const headNodeList = this.getHeadNodes();
			const nodeList = (this.nodeList = this.handleNodeList(
				headNodeList
			));
			const len = nodeList.length;
			for (let i = len; i--; i > -1) {
				this.updateUpTree(nodeList[i]);
			}
			this.rootNode = this.initRootNode(headNodeList.length);
		},
		updateUpTree(node, loop = false) {
			if (!node) return;
			const parentIndex = node.parent;
			if (!validVal(parentIndex)) return;
			const parent = this.nodeList[parentIndex],
				parentData = parent.data,
				isOnlySelf = this.getSelectOnlySelf(parentData.selectOnlySelf),
				data = node.data;
			console.log(isOnlySelf, "os");
			if (!isOnlySelf) {
				if (data.selected) {
					const isAll = parent.childIndexs.every(index => {
						return this.nodeList[index].data.selected;
					});
					this.$set(parentData, "selected", isAll);
					this.$set(parentData, "indeterminate", !isAll);
				} else {
					this.$set(parentData, "selected", false);
					this.$set(
						parentData,
						"indeterminate",
						parent.childIndexs.some(index => {
							const { selected, indeterminate } = this.nodeList[
								index
							].data;
							return selected || indeterminate;
						})
					);
				}
			}
			if (loop) this.updateUpTree(parent);
		},
		updateDownTree(node, changes = {}) {
			const data = node.data;
			for (let key in changes) {
				this.$set(data, key, changes[key]);
			}
			const childIndexs = node.childIndexs;
			if (childIndexs && childIndexs.length) {
				childIndexs.forEach(index => {
					this.updateDownTree(this.nodeList[index], changes);
				});
			}
		},
		getSelectOnlySelf(selectOnlySelf) {
			return selectOnlySelf == void 0 || selectOnlySelf === ""
				? this.selectOnlySelf
				: selectOnlySelf;
		},
		updateExpand(node, expand) {
			const linkIndex = node.linkIndex;
			if (this.multiple) {
				if (expand) {
					this.expandStatus.push(linkIndex);
				} else {
					const index = this.expandStatus.indexOf(linkIndex);
					index > -1 && this.expandStatus.splice(index, 1);
				}
			} else {
				this.expandStatus = expand ? [linkIndex] : [];
			}
			this.$emit("on-expand-change", expand, { ...node });
		},
		updateActive(node) {
			if (!this.toggleActive && !node) return;
			this.activeIndex = node ? node._linkIndex : null;
			this.$emit('on-active-change', this.activeIndex ? true : false, node ? { ...node } : null);
		},
		handleCheck(node, val) {
			if (!this.selection) return;
			const data = node.data,
				isOnlySelf = this.getSelectOnlySelf(data.selectOnlySelf);
			if (isOnlySelf) {
				this.$set(data, "selected", val);
				this.$set(data, "indeterminate", false);
			} else {
				this.updateDownTree(node, {
					selected: val,
					indeterminate: false
				});
			}
			this.$nextTick(() => {
				if (!isOnlySelf) this.updateUpTree(node, true);
				this.$emit(
					"on-select-change",
					val,
					{ ...node },
					this.filterData("selected", this.identifier),
					this.filterData("indeterminate", this.identifier)
				);
			});
		},
		filterData(key, targetKey, val = true) {
			const arr = [];
			this.nodeList.forEach(node => {
				const data = node.data;
				if (node[key] === val) {
					arr.push(
						targetKey !== void 0 ? node[targetKey] : { ...node }
					);
				}
			});
			return arr;
		},
		// 对外提供
		initStatus(key, val) {
			const index = this.nodeList.findIndex(node => {
				return node.data[key] == val;
			});
			this.updateExpand(index, true);
		},
		handleSortNode(linkIndex = "", compareLink = "") {
			linkIndex = linkIndex.split(",");
			compareLink = compareLink.split(",");
			return linkIndex.some((val, index) => {
				return val > (compareLink[index] || 0);
			});
		},
		updateNodeLinkList(node) {
			const identifier = this.identifier;
			const iteratorNode = (childIndexs, parent) => {
				childIndexs.forEach((key, index) => {
					const node = this.nodeList[key],
						id = node.data[identifier],
						obj = { ...node, sortIndex: index };

					if (parent) {
						obj.parent = parent.index;
						obj.linkIndex = parent.linkIndex
							? `${parent.linkIndex},${index}`
							: `${index}`;
						parent.childIds.push(id);
					}
					this.$set(this.nodeList, key, obj);
					const childIndexs = node.childIndexs;
					if (childIndexs && childIndexs.length) {
						obj.childIds = [];
						iteratorNode(childIndexs, obj);
					}
				});
			};
			const childIndexs = node.childIndexs;
			if (childIndexs) {
				node.childIds = [];
				iteratorNode(childIndexs, node);
			}
		},
		handleDragDrop(data) {
			if (data.type === "dragstart") {
				this._dragData = data;
				return;
			}
			if (
				data.type === "drop" &&
				data.linkIndex !== void 0 &&
				this._dragData
			) {
				const nodeList = this.nodeList,
					dragData = this._dragData,
					insert = data.insert,
					dragNode = nodeList[dragData.index],
					dropNode = nodeList[data.index],
					dragIndex = dragNode.sortIndex,
					dropIndex = dropNode.sortIndex,
					dragParent =
						dragNode.parent !== void 0
							? nodeList[dragNode.parent]
							: this.rootNode,
					dropParent =
						dropNode.parent !== void 0
							? nodeList[dropNode.parent]
							: this.rootNode,
					dragPChildIndexs = dragParent.childIndexs,
					dropPChildIndexs = dropParent.childIndexs;
				let type = "sort";
				if (insert == 2) {
					if (!dropNode.childIndexs)
						this.$set(dropNode, "childIndexs", []);
					dragPChildIndexs.splice(dragIndex, 1);
					dropNode.childIndexs.push(dragNode.index);
					type = "insert";
				} else {
					const isUp = insert == 1,
						type = isUp ? "up" : "down";
					dropPChildIndexs.splice(
						isUp ? dropIndex : dropIndex + 1,
						0,
						dragData.index
					);
					if (dropPChildIndexs === dragPChildIndexs) {
						dragPChildIndexs.splice(
							isUp ? dragIndex + 1 : dragIndex,
							1
						);
					} else {
						dragPChildIndexs.splice(dragIndex, 1);
					}
				}
				this.$nextTick(() => {
					this.updateNodeLinkList(dragParent);
					dragParent !== dropParent &&
						this.updateNodeLinkList(dropParent);
					this.$emit("on-drop-change", dragNode, dropNode, type);
				});
			}
			this.$nextTick(() => {
				this._dragData = this.reference = this.popperTip = null;
			});
		},
		handleDropTip(data, event) {
			if (!this.getDragPopper) return;
			const { value } = data;
			const reference = event.currentTarget.querySelector(
				`.${this._tobogPrefix_}node-text`
			);
			let popperTip = false;
			if (this.reference !== reference) this.reference = reference;
			if (value == 2) {
				popperTip = "作为子节点插入";
			} else if (value == 1) {
				popperTip = "作为前一节点插入";
			} else if (value == 3) {
				popperTip = "作为后一节点插入";
			} else {
				popperTip = false;
			}
			this.popperTip = popperTip;
		}
	}
};
</script>