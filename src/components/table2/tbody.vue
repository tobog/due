<template>
	<!-- <table cellspacing="0" cellpadding="0" border="0">
	<Colgroups :columns="columns"></Colgroups>-->
	<tbody>
		<template v-for="(row,_index) in data">
			<tr
				:key="row._index"
				:class="rowClasses(row._index)"
				@mouseenter="handleMouseIn(row._index)"
				@mouseleave="handleMouseOut(row._index)"
				@click="clickCurrentRow(row._index)"
			>
				<template v-for="(column,index) in columns">
					<Cell
						v-if="handleShow(index,_index,column,row)"
						tag="td"
						:key="column.key"
						:row="row"
						:column="column"
						:index="_index"
						:axis="[index,_index]"
						:render="column.render"
						:class="cellClasses(column)"
						:style="handleStyle"
						v-bind="createSpanAttrs(index,_index,column,row)"
					>
						<Checkbox
							v-if="column.type==='selection'"
							:radio="column.isRadio"
							:value="isCheck(column.key,row._index)"
							@click.native="handleCheckChange(column,row._index,_index,)"
						></Checkbox>
						<template v-else-if="column.type==='index'">{{_index+1}}</template>
						<div
							v-else-if="column.type==='expand'"
							@click="toggleExpand(row._index)"
							:class="expandCls(row._index)"
						>
							<Icons type="ios-arrow-forward"></Icons>
						</div>
						<div v-else-if="column.template" v-html="handleTemplate(column,row)"></div>
						<template v-else>{{row[column.key]}}</template>
					</Cell>
				</template>
			</tr>
			<tr
				v-if="rowExpanded(row._index)"
				:key="'expand'+row._index"
				:class="{[prefix + '-cell-hidden']: fixed}"
			>
				<Cell
					tag="td"
					:colspan="columns.length"
					:class="[prefix + '-expanded-cell']"
					:row="row"
					:render="renderExpand"
					:index="row._index"
				></Cell>
			</tr>
		</template>
	</tbody>
	<!-- </table> -->
</template>

<script>
import Cell from './render';
// import Colgroups from './colgroups';
import Icons from "../icons/src/index";
import { typeOf } from '../../utils/tool';
import Json from '../../utils/json';
import Checkbox from "../checkbox/src/index";

export default {
	name: 'TableBody',
	components: {
		Cell,
		// Colgroups,
		Checkbox,
		Icons
	},
	props: {
		simple: Boolean,
		columns: Array,
		data: Array, // rebuildData
		actionData: Object,
		prefix: String,
		size: [String, Number],
		fixed: {
			type: [Boolean, String],
			default: false,
		},
		columnStatus: Object,
	},
	computed: {
		handleStyle() {
			let size = this.size;
			switch (size) {
				case 'small': size = 36; break;
				case 'normal':
				case 'default': size = 46; break;
				case 'large': size = 60; break;
			}
			return size ? {
				height: `${size}px`,
			} : null
		},
		renderExpand() {
			for (let i = 0; i < this.columns.length; i++) {
				const column = this.columns[i];
				if (column._hasExpand) return column.renderExpand;
			}
		},
		getColsSpan() {
			return this.$parent.colSpanMap || []
		},
	},
	methods: {
		expandCls(index) {
			return [
				`${this.prefix}-cell-expand`,
				{
					[`${this.prefix}-cell-expanded`]: this.rowExpanded(index)
				}
			];
		},
		handleShow(xAxis, yAxis, column, row) {
			let rowsSpan = column.rowsSpan, isColHidden, isRowHidden;
			if (typeof rowsSpan === 'function') rowsSpan = rowsSpan.call(this, yAxis, row, column);
			if (rowsSpan instanceof Array) {
				isRowHidden = rowsSpan.some(function (item) {
					const { rowIndex = -1, rowspan = 0 } = item;
					return rowIndex > -1 && rowspan > 1 && yAxis > rowIndex && yAxis < rowspan + rowIndex;
				});
			}
			isColHidden = this.getColsSpan.some(function (item) {
				const { rowIndex = -1, colspan = 0, index } = item;
				return rowIndex > -1 && colspan > 1 && yAxis == rowIndex && xAxis > index && xAxis < colspan + index;
			});
			return !(isRowHidden || isColHidden);
		},
		createSpanAttrs(xAxis, yAxis, column, row) {
			const result = { rowspan: void 0, colspan: void 0 };
			let rowsSpan = column.rowsSpan, rowItem, colItem
			if (typeof rowsSpan === 'function') rowsSpan = rowsSpan.call(this, yAxis, row, column);
			if (rowsSpan instanceof Array) {
				rowItem = rowsSpan.find(function (item) {
					return yAxis == item.rowIndex
				});
			}
			colItem = this.getColsSpan.find(function (item) {
				return yAxis == item.rowIndex && xAxis == item.index
			});
			if (rowItem) result.rowspan = rowItem.rowspan;
			if (colItem) result.colspan = colItem.colspan;
			return result;
		},
		rowClasses(_index) {
			const action = this.actionData[_index] || {},
				_tobogPrefix_ = this.prefix;
			return [
				{
					[`${_tobogPrefix_}-row-highlight`]: action._isHighlight,
					[`${_tobogPrefix_}-row-hover`]: action._isHover,
				},
			];
		},
		cellClasses(column = {}) {
			const _tobogPrefix_ = this.prefix,
				fixed = this.fixed;
			return [
				`${_tobogPrefix_}-cell`,
				{
					[`${_tobogPrefix_}-cell-hidden`]: (fixed && column.fixed !== fixed) || (!fixed && column.fixed),
					[`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
					[`${_tobogPrefix_}-cell-${column.align}`]: !!column.align,
				},
			];
		},
		// 处理多层次的key
		// isTemplateKey(key = '') {
		// 	return /\{([^{}])+\}/g.test(key);
		// },
		handleTemplate(column, row) {
			const template=column.template||'';
			row={...row,...column.row};
			return `${template}`.replace(/\{([^{}])+\}/g, function (match, reg) {
				return Json.evalKeys(match.substring(1, match.length - 1), row)
			})
		},
		toggleExpand(_index) {
			this.$parent.toggleExpand(_index);
		},
		handleMouseIn(_index) {
			if (this.simple) return;
			this.$parent.handleMouseIn(_index);
		},
		handleMouseOut(_index) {
			if (this.simple) return;
			this.$parent.handleMouseOut(_index);
		},
		rowExpanded(_index) {
			return this.actionData[_index]._isExpanded;
		},
		clickCurrentRow(_index) {
			this.__clickCount = (this.__clickCount || 0) + 1;
			clearTimeout(this.__clickCountTimeout)
			this.__clickCountTimeout = setTimeout(() => {
				this.$parent.clickCurrentRow(_index, this.__clickCount > 1);
				this.__clickCountTimeout = this.__clickCount = null;
			}, 300)
		},
		isCheck(key, _index) {
			return (this.columnStatus.check[key] || []).some(function (item) {
				return item == _index
			})
		},
		handleCheckChange(column, _index,index) {
			this.$emit('on-column-status', 'check', column, !this.isCheck(column.key, _index), 'check', index);
		},

	},
	beforeDestroy() {
		clearTimeout(this.__clickCountTimeout);
		this.__clickCountTimeout = null;
	}
};
</script>
