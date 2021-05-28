<template>
	<li :class="wrapClasses" :data-linkindex="node.linkIndex" :data-index="node.index">
		<div v-if="getDragLine && dragValue === 1" :class="[_tobogPrefix_ + '-drag-line']"></div>
		<component
			:is="getTag"
			:class="cellClasses"
			:style="cellStyles"
			:draggable="draggable"
			@click.stop="handleOpen"
			@dragstart.stop="handleDragStart"
			@dragover.stop.prevent="handleDragover"
			@dragend="handleDragend"
			@dragleave="handleDragend"
			@drop.stop.prevent="handleDrop"
			v-bind="getNodeData.props"
		>
			<span v-if="hasChildren && !isMenu && !isTransverse" :class="dirClasses" data-type="dir">
				<slot>
					<Icons type="arrow-dropright" size="1.6em" />
				</slot>
			</span>
			<span v-else-if="indent && !isTransverse" data-type="indent" :class="dirClasses">
				<slot>
					<Icons type="arrow-dropright" size="1.6em" />
				</slot>
			</span>
			<span
				v-if="getNodeData.icon&&getNodeData.iconType === 'html'"
				:class="[_tobogPrefix_ + '-icon',_tobogPrefix_ + '-icon-html']"
				v-html="getNodeData.icon"
			></span>
			<Icons
				v-if="getNodeData.icon&&getNodeData.iconType !== 'html'"
				:class="[_tobogPrefix_ + '-icon']"
				:type="getNodeData.icon"
			></Icons>
			<Checkbox
				v-if="selection"
				size="1.2em"
				readonly
				:class="[_tobogPrefix_ + '-icon', _tobogPrefix_ + '-checkbox']"
				@click.native.stop="handleCheck"
				:value="getNodeData.selected"
				:disabled="getNodeData.disabled"
				:indeterminate="getNodeData.indeterminate"
			/>
			<span :class="[_tobogPrefix_ + '-text']" v-if="!getRender">{{ getNodeData.title }}</span>
			<Render
				v-else
				:render="getRender"
				:parent="parent"
				:node="node"
				:class="[_tobogPrefix_ + '-text']"
			/>
			<span v-if="hasChildren && isMenu && !isTransverse" :class="dirClasses">
				<slot>
					<Icons type="ios-arrow-forward" />
				</slot>
			</span>
			<span v-if="hasChildren && isTransverse && (expand || always)" :class="dirClasses">
				<slot>=></slot>
			</span>
		</component>
		<div
			v-if="getDragLine && dragValue === 3"
			:class="[_tobogPrefix_ + '-drag-line']"
			:key="node.linkIndex"
		></div>
		<ueTransition v-if="hasChildren" tag="ul" :class="[_tobogPrefix_ + '-next']" name="node">
			<template v-for="child in getChildren">
				<TreeNode
					v-if="expand || always"
					:key="child.linkIndex"
					:multiple="multiple"
					:draggable="draggable"
					:isTransverse="isTransverse"
					:selection="selection"
					:expandStatus="expandStatus"
					:type="type"
					:node="child"
					:parent="node"
					:always="always"
					:activeIndex="activeIndex"
					:indent="indent"
				></TreeNode>
			</template>
		</ueTransition>
	</li>
</template>

<script>
import Icons from "../icons/src/index";
import Render from "./render";
import Checkbox from "../checkbox/src/index";
import ueTransition from "../base/transition";

export default {
	name: "TreeNode",
	inject: ["$RootTreeInstance"],
	components: {
		Checkbox,
		Icons,
		Render,
		ueTransition
	},
	props: {
		always: Boolean,
		multiple: Boolean,
		draggable: Boolean,
		selection: Boolean,
		isTransverse: Boolean,
		expandStatus: Array,
		type: String,
		parent: Object,
		indent: Boolean,
		dragTip: String,
		activeIndex: String,
		node: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			expand: false,
			dragValue: 0
		};
	},
	created() {
		this.expand = this.getNodeData.expand;
	},
	watch: {
		expandStatus: {
			immediate: true,
			deep: true,
			handler(val) {
				if (!val || !val.length) return;
				this.updateExpand(val);
			}
		}
	},
	computed: {
		isMenu() {
			return this.type === "menu";
		},
		getTag() {
			const props = this.getNodeData.props || false;
			if (props && typeof props === "object") {
				const { tag, to } = props;
				if (tag) return tag;
				if (to) return this.$router ? 'router-link' : 'a';
			}
			return "div";
		},
		getNodeData() {
			return this.node.data;
		},
		getChildIndexs() {
			return this.node.childIndexs;
		},
		hasChildren() {
			return this.getChildIndexs && this.getChildIndexs.length > 0;
		},
		getChildren() {
			return this.$RootTreeInstance.getChildren(this.getChildIndexs);
		},
		getRender() {
			const render = this.getNodeData.render || this.$RootTreeInstance.render;
			return typeof render === 'function' && render
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-open`]: this.expand || this.always,
					[`${_tobogPrefix_}-active`]: this.activeIndex === this.node._linkIndex
				}
			];
		},
		cellClasses() {
			let _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-title`,
				...[this.getNodeData.class || ""],
				{
					[`${_tobogPrefix_}-menu`]: this.isMenu,
					[`${_tobogPrefix_}-drag-insert`]: this.dragValue === 2,
					[`${_tobogPrefix_}-title-open`]: this.expand || this.always,
					[`${_tobogPrefix_}-title-active`]: this.activeIndex === this.node._linkIndex
				}
			];
		},
		cellStyles() {
			let style = this.node.style || "";
			if (this.isTransverse) return;
			let val = this.deep * 22 + "px";
			if (typeof style === "string") {
				style += `;padding-left:${val};`;
			} else {
				style = {
					'paddingLeft': val,
					...style
				};
			}
			return style;
		},
		dirClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [`${_tobogPrefix_}-icon`, `${_tobogPrefix_}-dir`];
		},
		deep() {
			return this.node.linkIndex.split(",").length - 1;
		},
		getDragLine() {
			return this.$RootTreeInstance.getDragLine;
		}
	},
	methods: {
		handleOpen(event) {
			const node = this.node,
				click = node.click;
			if (typeof click === "function")
				click.call(this, { ...node }, event);
			if (!this.hasChildren) {
				if (this.selection) this.handleCheck();
				this.$RootTreeInstance.$emit('on-active', this.activeIndex === node._linkIndex ? null : node);
			}
			if (!this.hasChildren || this.always || node.data.disabled) return;
			this.expand = !this.expand;
			this.$RootTreeInstance.$emit("on-expand", node, this.expand);
		},
		updateExpand(val) {
			if (this.always) return;
			const linkIndex = this.node.linkIndex;
			this.expand =
				linkIndex &&
				val.some(item => {
					return item.indexOf(linkIndex) == 0;
				});
		},
		handleCheck() {
			const { disabled, selected } = this.getNodeData;
			if (disabled) return;
			this.$RootTreeInstance.$emit("on-check", this.node, !selected);
		},
		handleDragStart() {
			if (!this.draggable) return;
			this.dragValue = 0;
			const { linkIndex, index } = this.node;
			this.$RootTreeInstance.$emit("on-dragDrop", {
				linkIndex,
				index,
				type: "dragstart"
			});
		},
		handleDragend(event) {
			this.dragValue = 0;
			if (!this.draggable || event.type !== "dragend") return;
			this.$RootTreeInstance.$emit("on-dragDrop", { type: "dragend" });
		},
		handleDrop(event) {
			this.dragValue = 0;
			const dragData = this.$RootTreeInstance._dragData;
			if (!this.draggable || !dragData) return;
			const dragLinkIndex = dragData.linkIndex,
				{ linkIndex, index } = this.node;
			if (linkIndex && linkIndex.indexOf(dragLinkIndex) != 0) {
				const insert = this.handleDragover(event);
				this.$RootTreeInstance.$emit("on-dragDrop", {
					linkIndex,
					index,
					type: "drop",
					insert
				});
			}
			this.$nextTick(() => {
				this.dragValue = 0;
			});
		},
		handleDragover(event) {
			if (!this.draggable) return;
			this.dragValue = 0;
			const dragData = this.$RootTreeInstance._dragData || {},
				dragLinkIndex = dragData.linkIndex,
				linkIndex = this.node.linkIndex;
			let value = 2;
			if (
				linkIndex !== dragLinkIndex &&
				linkIndex.indexOf(dragLinkIndex) != 0
			) {
				const { currentTarget, clientY } = event;
				const pos = currentTarget.getBoundingClientRect();
				const offsetHeight = currentTarget.offsetHeight;
				const offsetY = clientY - pos.top;
				if (offsetY > offsetHeight - offsetHeight / 3) {
					value = 3;
				}
				if (offsetY < offsetHeight - (2 * offsetHeight) / 3) {
					value = 1;
				}
			} else {
				value = 0;
			}
			this.dragValue = value;
			this.$RootTreeInstance.$emit(
				"on-dropTip",
				{
					value,
					node: this.node
				},
				event
			);
			return value;
		}
	}
};
</script>
