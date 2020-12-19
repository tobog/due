<template>
	<!-- <table cellspacing="0" cellpadding="0" border="0">
	<Colgroups :columns="columns"></Colgroups>-->
	<thead>
		<tr v-for="(cols, _index) in headRows" :key="_index">
			<Cell
				v-for="(column,index) in cols"
				tag="th"
				:key="index"
				:column="column"
				:colspan="column.colSpan"
				:rowspan="column.rowSpan"
				:title="column.desc"
				:index="index"
				:axis="[index,_index]"
				:render="column.renderHeader"
				:class="cellClasses(column)"
			>
				<Tooltip v-if="column.tooltip">
					{{column.title}}
					<div :class="[prefix+'-tooltip']" slot="content" v-html="column.tooltip"></div>
				</Tooltip>
				<template v-else>{{column.title}}</template>
				<Sort
					v-if="column.sortable&&column.key"
					:sort="columnStatus.sort[column.key]"
					@on-change="(sort)=>handleSortChange(sort,column)"
				></Sort>
				<Checkbox
					v-if="column.type==='selection'&&!column.isRadio"
					:value="isCheckAll(column.key)"
					:disabled="!dataLength"
					@click.native="handleCheckChange(column)"
				></Checkbox>
				<Dropdown v-if="(column.filters||[]).length>0">
					<Icons type="ios-funnel" :style="{color:columnStatus.filter[column.key]?'red' : ''}"></Icons>
					<template slot="list">
						<div
							v-for="(filter,key) in column.filters"
							:key="key"
							style="padding:5px 10px;cursor:pointer"
							@click="handleFilterChange(filter.value,column)"
							v-html="filter.label"
						></div>
					</template>
				</Dropdown>
				<div
					v-if="column.dragable"
					v-drag-move="(axis)=>handleSplit(index,axis)"
					:class="splitClasses"
				>&nbsp;</div>
			</Cell>
		</tr>
	</thead>
	<!-- </table> -->
</template>

<script>
import Cell from "./render.js";
import Sort from "../sort/index";
import Dropdown from "../dropdown/index";
import Tooltip from "../tooltip/index";
import Icons from "../icons/index";
import Checkbox from "../checkbox/index";
import DragMove from '../../directives/drag-move';
import { getStyle } from '../../utils/dom';
export default {
	name: "TableHead",
	components: {
		Cell,
		Tooltip,
		Sort,
		Checkbox,
		Dropdown,
		Icons
	},
	directives: {
		DragMove
	},
	props: {
		fixed: {
			type: [Boolean, String],
			default: false
		},
		columns: Array,
		prefix: String,
		columnRows: Array,
		actionData: Object,
		columnStatus: Object,
		dataLength: Number
	},
	computed: {
		headRows() {
			const isGroup = this.columnRows.length > 1;
			if (isGroup) {
				return this.columnRows;
			} else {
				return [this.columns];
			}
		},
		splitClasses() {
			return this.prefix + '-splitbar'
		},

	},
	methods: {
		isCheckAll(key) {
			return this.dataLength != 0 && (this.columnStatus.check[key] || "").length === this.dataLength
		},
		handleSortChange(sort, column) {
			this.$emit('on-column-status', 'sort', sort, column)
		},
		handleCheckChange(column) {
			this.$emit('on-column-status', 'check', column, !this.isCheckAll(column.key), 'checkAll');
		},
		handleFilterChange(filter, column) {
			this.$emit('on-column-status', 'filter', filter, column);
		},
		cellClasses(column, value) {
			const _tobogPrefix_ = this.prefix;
			return [{
				[`${_tobogPrefix_}-cell-hidden`]: this.fixed && column.fixed !== this.fixed,
				[`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
				[`${_tobogPrefix_}-cell-${column.align}`]: !!column.align
			}];
		},
		handleSplit(index, axis) {
			if (!this.__oncesplit) {
				const parentNode = axis.element.parentNode,
					style = axis.element.style,
					size = (parseInt(getStyle(parentNode, 'paddingRight')) || 6) * 2;
				this.__oncesplit = true;
				style.marginRight = -size + 'px';
				style.width = size + 'px';
			}
			this.$emit('on-split-moving', index, axis);
		},
	}
};
</script>
