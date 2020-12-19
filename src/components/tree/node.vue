<template>
	<li
		:class="wrapClasses"
		:data-linkindex="node._linkIndex"
		v-click-outside="hide"
	>
		<div
			v-if="type==='tree'"
			:class="cellClasses"
			:style="cellStyles"
			:draggable="draggable"
			@click.stop="handleOpen"
			@dragstart.stop="handleDragStart(false,$event)"
			@dragover.stop.prevent
			@drop.stop="handleDrop"
		>
			<span v-if="hasChildren" :class="dirClasses" @drop.stop="handleDrop" data-type="dir">
				<slot>
					<Icons type="arrow-dropright" />
					<Icons type="arrow-dropdown" />
				</slot>
			</span>
			<template v-else>
				<span v-if="indent" data-type="indent" :class="dirClasses">
					<slot>
						<Icons type="arrow-dropright" />
						<Icons type="arrow-dropdown" />
					</slot>
				</span>
			</template>
			<Icons
				v-if="node.icon&&node.iconType!=='html'"
				:type="node.icon"
				:class="[_tobogPrefix_+'-icon']"
				:draggable="draggable"
				@dragstart.stop="handleDragStart(true,$event)"
			></Icons>
			<span
				v-if="node.icon&&node.iconType==='html'"
				v-html="node.icon"
				:class="[_tobogPrefix_+'-icon']"
				:draggable="draggable"
				@dragstart.stop="handleDragStart(true,$event)"
			></span>
			<Checkbox
				v-if="selection"
				:class="[_tobogPrefix_+'-icon ',_tobogPrefix_+'-checkbox']"
				@click.native.stop="handleCheck"
				:value="node.selected"
				:disabled="node.disabled"
				:indeterminate="node._indeterminate"
			/>

			<span v-if="!renderer" v-html="node.title"></span>
			<RenderCell v-else :render="renderer" :node="parent" :data="node" />
		</div>
		<RenderCell
			v-if="type==='menu'"
			:class="cellClasses"
			:style="cellStyles"
			:render="renderer"
			:data="node"
			:node="parent"
			v-bind="handleProps"
			@click="handleOpen"
		>
			<Icons
				:type="node.icon"
				v-if="node.icon&&node.iconType!=='html'"
				:class="[_tobogPrefix_+'-icon']"
			></Icons>
			<span
				v-if="node.icon&&node.iconType==='html'"
				:class="[_tobogPrefix_+'-icon']"
				v-html="node.icon"
			></span>
			<Checkbox
				v-if="selection"
				:class="[_tobogPrefix_+'-icon ',_tobogPrefix_+'-checkbox']"
				@click.native.stop="handleCheck"
				:value="node.selected"
				:disabled="node.disabled"
				:indeterminate="node._indeterminate"
			/>
			<span v-html="node.title"></span>
			<span v-if="hasChildren" :class="dirClasses">
				<slot>
					<Icons type="ios-arrow-forward" />
					<Icons type="ios-arrow-down" />
				</slot>
			</span>
		</RenderCell>
		<vTransition v-if="hasChildren" tag="ul" :class="[_tobogPrefix_+'-next']" name="node">
			<!-- <template v-if="expand||always"> -->
			<TreeNode
				v-if="expand||always"
				v-for="(child,index) in children"
				:key="index"
				:multiple="multiple"
				:draggable="draggable"
				:selection="selection"
				:direction="direction"
				:status="status"
				:activeIndex="activeIndex"
				:type="type"
				:node="child"
				:parent="node"
				:root="rootctx"
				:always="always"
				:indent="indent"
			></TreeNode>
			<!-- </template> -->
		</vTransition>
	</li>
</template>

<script>
import Icons from '../icons/index';
import RenderCell from './render';
import Checkbox from '../checkbox/index';
import vTransition from '../base/vTransition';
import ClickOutside from '../../directives/click-outside';

export default {
	name: 'TreeNode',
	directives: { ClickOutside },
	components: {
		Checkbox,
		Icons,
		RenderCell,
		vTransition,
	},
	props: {
		always: Boolean,
		multiple: Boolean,
		direction: String,
		draggable: Boolean,
		selection: Boolean,
		status: Array,
		type: String,
		parent: Object,
		root: Object,
		indent: Boolean,
		activeIndex: String,
		node: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			expand: this.node.expand
		};
	},
	created() {
		const slot = this.rootctx.$slots.default;
		if (slot) this.$slots.default = slot;
	},
	watch: {
		status: {
			immediate: true,
			deep: true,
			handler(val) {
				if (!val || val.length < 1) return;
				this.initStatus(val);
			},
		},
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-open`]: this.expand || this.always,
					[`${this._tobogPrefix_}-active`]: this.activeIndex === this.node._linkIndex
				}
			];
		},
		hasChildren() {
			return this.children && this.children.length
		},
		rootctx() {
			return this.root || this.$parent;
		},
		renderer() {
			return this.node.render || this.rootctx.render;
		},
		handleProps() {
			const props = this.node.props || undefined;
			if (typeof props === 'object') {
				let { tag, to } = props;
				if (tag) return props;
				if (to) tag = 'router-link';
				return { ...props, tag };
			}
			return null;
		},
		cellClasses() {
			let className = this.node.class;
			className = typeof className === 'function' ? className.call(this) : className
			return [
				`${this._tobogPrefix_}-title`,
				{
					[`${this._tobogPrefix_}-title-active`]: this.activeIndex === this.node._linkIndex
				},
				className || ''
			]
		},
		children() {
			return this.node.children || false;
		},
		cellStyles() {
			// let style = `paddingLeft:${this.deep * 22}px;`;
			// if (this.type === 'menu') {
			// 	style = `paddingLeft:${this.deep * 22}px;`;
			// } else {
			// 	style = `marginLeft:${this.deep * 22}px;`;
			// }
			let style = this.node.style;
			style = (typeof style === 'function' ? style.call(this) : style) || ''
			if (typeof style === 'object') {
				return {
					paddingLeft: `${this.deep * 22}px`,
					...style
				}
			}
			return `paddingLeft:${this.deep * 22}px;` + style;
		},
		deep() {
			return this.node._linkIndex.split(',').length - 1;
		},
		dirClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-icon`,
				`${_tobogPrefix_}-diricon`,
				{
					[`${_tobogPrefix_}-diricon-open`]: this.expand,
				},
			];
		},
	},
	methods: {
		hide(status) {
			if (this.always || !status) return;
			if (this.direction === 'horizontal' && this.type === 'menu' && !this.multiple) {
				this.expand = false;
			}
		},
		initStatus(val) {
			if (this.always) return;
			if (val[this.deep] !== undefined && val[this.deep] == this.node._deepIndex) {
				this.expand = true;
			} else if (!this.multiple) {
				this.expand = false;
			}
		},
		handleOpen(event) {
			const node = this.node,
				click = node.click;
			if (typeof click === 'function') click.call(this, { ...node }, event);
			if (!this.hasChildren) this.rootctx.$emit('on-active', this.activeIndex === node._linkIndex ? null : node);
			if (!this.hasChildren || this.always || node.disabled) return;
			this.expand = !this.expand;
			this.rootctx.$emit('on-status', node, this.expand);
		},
		handleDragStart(insert = false, event) {
			if (!this.draggable) return;
			const { _linkIndex, _index } = this.node;
			// sessionStorage.vviewTreeDragData = _linkIndex;
			event.dataTransfer.setData('text', JSON.stringify({ _linkIndex, _index, insert }));
		},
		// handleDragEnter(event) {
		// 	event.preventDefault();
		// 	const _linkIndex = this.node._linkIndex;
		// 	if (!this.expand && _linkIndex !== sessionStorage.vviewTreeDragData) this.handleOpen(event);
		// },
		// handleDragLeave(event) {
		// 	event.preventDefault();
		// 	const data=sessionStorage.vviewTreeDropData;
		// 	if(data&&this.node._linkIndex.indexOf(data)==0)
		// },
		handleDrop(event) {
			if (!this.draggable) return;
			event.preventDefault();
			const dragData = JSON.parse(event.dataTransfer.getData('text') || '{}'),
				dragLinkIndex = dragData._linkIndex,
				dropLinkIndex = this.node._linkIndex || '';
			// iSdrag = dropLinkIndex.indexOf(dragLinkIndex) != 0;
			// iSdrop = dragLinkIndex.indexOf(dropLinkIndex) > -1||event.currentTarget.dataset.type === 'dir';
			if (dropLinkIndex.indexOf(dragLinkIndex) != 0) {
				this.rootctx.$emit('on-drop', this.node._index, dragData._index, event.currentTarget.dataset.type === 'dir');
			}
		},
		handleCheck() {
			const node = this.node;
			if (node.disabled) return;
			this.rootctx.$emit('on-check', !node.selected, node);
		},
	},
};
</script>
