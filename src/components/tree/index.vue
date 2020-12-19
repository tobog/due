<template>
	<ul :class="wrapClasses" :key="type">
		<template v-for="(child,index) in cloneNodes">
			<Cell
				:ref="index"
				:key="index"
				:draggable="draggable"
				:selection="selection"
				:type="type"
				:node="child"
				:parent="parentNode"
				:direction="direction"
				:status="status"
				:multiple="multiple"
				:always="always"
				:activeIndex="activeIndex"
				:indent="indent"
			></Cell>
		</template>
	</ul>
</template>

<script>
import Cell from './node';
import { deepCopy } from '../../utils/tool';

export default {
	name: 'Tree',
	components: { Cell },
	props: {
		draggable: Boolean,
		render: Function,
		selection: Boolean,
		multiple: Boolean,
		always: Boolean,
		data: {
			type: Array,
			default() {
				return [];
			},
		},
		type: {
			type: String,
			// validator(value) {
			// 	return oneOf(value, ['tree', 'menu']);
			// },
			default: 'tree',
		},
		theme: {
			type: String,
			// default: 'primary',
		},
		direction: {
			// validator(value) {
			// 	return oneOf(value, ['horizontal', 'vertical']);
			// },
			default: 'vertical',
		},
		identifier: {
			type: String,
			default: "key"
		},
		indent: {
			type: Boolean,
			default: true,
		},
		toggleActive: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			cloneNodes: [],
			status: null,
			activeIndex: '',
			linkedList: [],
		};
	},
	created() {
		this.$on('on-check', this.handleCheck);
		this.$on('on-drop', this.handleDrop);
		this.$on('on-status', this.updateStatus);
		this.$on('on-active', this.updateActive);
		this.initData(this.data);
	},
	watch: {
		data: {
			deep: true,
			handler(val) {
				this.initData(val);
			},
		},
	},

	computed: {
		parentNode() {
			return {
				children: this.cloneNodes
			}
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.type}`]: !!this.type,
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
					[`${_tobogPrefix_}-${this.direction}`]: !!this.direction,
				},
			];
		},
	},
	methods: {
		// 对外提供
		initStatus(linkIndex = '') {
			if (linkIndex instanceof Array) {
				const key = linkIndex[0] || this.identifier,
					val = linkIndex[1],
					data = this.linkedList.find(function (item) {
						return item.node[key] == val;
					}) || { node: {} };
				linkIndex = data.node._linkIndex || "";
			}
			console.log(linkIndex)
			this.status = linkIndex.split(',');
		},
		initData(val) {
			this.cloneNodes = deepCopy(val);
			this.linkedList = this.compileNodeState();
			for (let i = this.linkedList.length; i--; i > -1) {
				this.updateUpTree(this.linkedList[i].node);
			}
		},
		updateStatus(node, expand) {
			if (expand) this.initStatus(node._linkIndex);//用来跟新非multiple的
			this.$emit('on-expand-change', expand, { ...node });
		},
		updateActive(node) {
			if (!this.toggleActive && !node) return;
			this.activeIndex = node ? node._linkIndex : null;
			this.$emit('on-active-change', this.activeIndex ? true : false, node ? { ...node } : null);
		},
		compileNodeState() {
			let key = 0, linkedList = [],
				convertNode = function (data, parent = '') {
					data.forEach((node, index) => {
						let _index = key++, obj = { node, _index };
						node._index = _index;
						node._deepIndex = index;
						linkedList[_index] = obj;
						if (parent) {
							const parentNode = parent.node;
							node._linkIndex = `${parentNode._linkIndex},${index}`;
							obj.parent = parent._index;
							parent.children.push(_index);
						} else {
							node._linkIndex = `${index}`;
						}
						if (node.children) {
							obj.children = [];
							convertNode(node.children, obj);
						}
					});
				};
			convertNode(this.cloneNodes);
			return linkedList;
		},
		handleDrop(dropIn, dragIn, insert) {
			const linkedList = this.linkedList;
			const cloneNodes = this.cloneNodes;
			let dragData = linkedList[dragIn],
				dropData = linkedList[dropIn],
				dragTemp = dragData.node,
				dropTemp = dropData.node,
				dragIndex = dragTemp._deepIndex,
				dropIndex = dropTemp._deepIndex,
				dragPChildren = dragData.parent !== undefined ? linkedList[dragData.parent].node.children : cloneNodes,
				dropPChildren = dropData.parent !== undefined ? linkedList[dropData.parent].node.children : cloneNodes,
				type = 'sort';
			if (insert) {
				if (!dropTemp.children) this.$set(dropTemp, 'children', []);
				dropTemp.children.push(dragPChildren.splice(dragIndex, 1)[0]);
				type = 'insert';
			} else {
				const isUp = dragIn > dropIn;
				type = isUp ? 'up' : 'down';
				dropPChildren.splice(isUp ? dropIndex : dropIndex + 1, 0, dragTemp);
				dragPChildren.some(function (item, index) {
					if (item === dragTemp) {
						dragPChildren.splice(index, 1);
						return true;
					}
				})
			}

			// if (insert) {
			// 	if (!dropTemp.children) this.$set(dropTemp, 'children', []);
			// 	dropTemp.children.push(dragPChildren.splice(dragIndex, 1)[0]);
			// 	type = 'insert';
			// } else {
			// 	if (dragPChildren === dropPChildren) {
			// 		if (dragIndex < dropIndex) {
			// 			type = 'down';
			// 		} else {
			// 			type = 'up';
			// 		}
			// 		dropPChildren.splice(dragIndex, 1);
			// 		dropPChildren.splice(dropIndex, 0, dragTemp);
			// 	} else {
			// 		this.$set(dragPChildren, dragIndex, dropTemp);
			// 		this.$set(dropPChildren, dropIndex, dragTemp);
			// 		type = 'exchange';
			// 	}
			// }
			this.linkedList = this.compileNodeState();
			this.$nextTick(() => {
				this.updateUpTree(dragTemp, true);
				this.$nextTick(() => {
					this.$forceUpdate();
					this.$emit('on-drop-change', dragTemp, dropTemp, type);
				})
			})
		},
		handleCheck(val, node) {
			if (!this.selection) return;
			this.updateDownTree(node, { selected: val, _indeterminate: false });
			this.$nextTick(() => {
				this.updateUpTree(node, true);
				this.$emit('on-check-change', val, { ...node }, this.filterData('selected', this.identifier), this.filterData('_indeterminate', this.identifier));
			});
		},
		updateDownTree(node, changes = {}) {
			for (let key in changes) {
				this.$set(node, key, changes[key]);
			}
			const children = node.children;
			if (children && children.length) {
				children.forEach(child => {
					this.updateDownTree(child, changes);
				});
			}
		},
		updateUpTree(node, loop = false) {
			if (!node) return;
			const data = this.linkedList[node._index], parentKey = data.parent;
			if (parentKey === undefined) return;
			const parent = this.linkedList[parentKey].node;
			if (node.selected) {
				const isAll = parent.children.every(node => node.selected);
				this.$set(parent, 'selected', isAll);
				this.$set(parent, '_indeterminate', !isAll);
			} else {
				this.$set(parent, 'selected', false);
				this.$set(parent, '_indeterminate', parent.children.some(node => node.selected || node._indeterminate));
			}
			if (loop) {
				this.updateUpTree(parent);
			}
		},
		filterData(key, targetKey, val = true) {
			const arr = [];
			this.linkedList.forEach(child => {
				const node = child.node;
				if (node[key] === val) {
					arr.push(targetKey !== undefined ? node[targetKey] : { ...node });
				}
			});
			return arr;
		},
	},
	beforeDestroy() {
		this.$off('on-check', this.handleCheck);
		this.$off('on-drop', this.handleDrop);
		this.$off('on-status', this.updateStatus);
	},
};
</script>