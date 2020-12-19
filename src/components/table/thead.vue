<template>
	<thead>
		<tr v-if="cols.length" v-for="(cols, rowIndex) in columns" :key="rowIndex">
			<Cell
				v-for="(column,colIndex) in cols"
				tag="th"
				:key="colIndex"
				:column="column"
				:colspan="column.colSpan"
				:rowspan="column.rowSpan"
				:title="column.desc"
				:class="cellClasses(column)"
				:index="colIndex"
				:axis="[colIndex,rowIndex]"
				:style="handleStyle(column,colIndex,rowIndex)"
				@mouseenter.native.stop="showToolTip(column,$event)"
				@mouseleave.native.stop="hideToolTip"
			>
				<span>{{column.title}}</span>
				<Sort
					v-if="column.sortable&&column.key"
					:sort="columnStatus.sort[column.key]"
					@on-change="(sort)=>handleSortChange(sort,column)"
				></Sort>
				<Checkbox
					v-if="column.type==='selection'&&!column.isRadio"
					:value="isCheckAll(column.key)"
					:disabled="!dataLength"
					readonly
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
				<span
					v-if="column.dragable"
					@mouseenter="getSplitTarget(column,$event)"
					:class="splitClasses"
				>&nbsp;</span>
			</Cell>
		</tr>
	</thead>
</template>

<script>
import Cell from "./render.js";
import Sort from "../sort/index";
import Dropdown from "../dropdown/index";
import Icons from "../icons/index";
import Checkbox from "../checkbox/index";
import { DragMove } from '../../utils/dom';
import { unit } from '../../utils/tool';
export default {
	name: "TableHead",
	components: {
		Cell,
		Sort,
		Checkbox,
		Dropdown,
		Icons
	},
	props: {
		fixed: {
			type: [Boolean, String],
			default: false
		},
		cellsSize: Object,
		columns: Array,
		prefix: String,
		actionData: Object,
		columnStatus: Object,
		dataLength: Number,
		rightIndex: Array,
		layoutFixed: Boolean
	},
	computed: {
		splitClasses() {
			return this.prefix + '-splitbar'
		},
		isLeftFixed() {
			return this.fixed === 'left'
		},
		isRightFixed() {
			return this.fixed === 'right'
		},
		isTopFixed() {
			return this.fixed === 'top'
		},
	},
	methods: {
		handleStyle(column, colIndex, rowIndex) {
			if (this.layoutFixed) return;
			const cellsSize = this.cellsSize,
				style = {};
			if (cellsSize) {
				if (this.isLeftFixed) {
					const [width, height] = cellsSize[`${rowIndex}/${colIndex}`] || [];
					if (!width || !height) return;
					style.width = style.minWidth = style.maxWidth = unit(width, 'px');
					style.height = style.minHeight = style.maxHeight = unit(height, 'px');
				} else if (this.isRightFixed) {
					const rightIndex = this.rightIndex[rowIndex] || 0;
					const [width, height] = cellsSize[`${rowIndex}/${rightIndex + colIndex}`] || [];
					if (!width || !height) return;
					style.width = style.minWidth = style.maxWidth = unit(width, 'px');
					style.height = style.minHeight = style.maxHeight = unit(height, 'px');
				} else if (this.isTopFixed) {
					const [width] = cellsSize[`${rowIndex}/${colIndex}`] || [];
					if (!width) return;
					style.width = style.minWidth = style.maxWidth = unit(width, 'px');
				}
				return style
			}
			const { minWidth, maxWidth, width } = column;
			if (minWidth && minWidth != 0) {
				style.minWidth = unit(minWidth, 'px');
			}
			if (maxWidth && maxWidth != 0) {
				style.maxWidth = unit(maxWidth, 'px');
			}
			if (width && width != 0) {
				style.width = style.minWidth = style.maxWidth = unit(width, 'px');
			}
			return style;
		},
		handleSortChange(sort, column) {
			this.$emit('on-column-status', 'sort', sort, column)
		},
		isCheckAll(key) {
			return this.dataLength != 0 && (this.columnStatus.check[key] || "").length === this.dataLength
		},
		handleCheckChange(column) {
			this.$emit('on-column-status', 'check', column, !this.isCheckAll(column.key), 'selectAll');
		},
		handleFilterChange(filter, column) {
			this.$emit('on-column-status', 'filter', filter, column);
		},
		cellClasses(column, value) {
			const _tobogPrefix_ = this.prefix;
			return [
				// `${_tobogPrefix_}-cell`,
				{
					[`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
					[`${_tobogPrefix_}-cell-${column.align}`]: !!column.align
				}];
		},
		getSplitTarget(column, event) {
			const target = event.currentTarget.parentNode;
			if (this._DragMove && this._splitTarget !== target) {
				this._DragMove.update(target);
				return;
			}
			this._splitTarget = target;
			this._DragMove = new DragMove(target, { style: ['width'] }, (obj) => {
				const { distance, data } = obj;
				distance&&this.$parent.setSplitWidth(column, parseFloat(data.width) + distance[0])
			});
		},
		showToolTip(column, event) {
			if (column.tooltip) this.$parent.tooltip = {
				show: true,
				reference: event.currentTarget.firstChild,
				content: column.tooltip
			}
		},
		hideToolTip() {
			this.$parent.tooltip = {
				show: false
			}
		}
	}
};
</script>
