<template>
	<tbody>
		<template v-for="(row,rowIndex) in data">
			<tr
				:key="row._index"
				:class="rowClasses(row._index)"
				@mouseenter="handleMouseIn(row._index)"
				@mouseleave="handleMouseOut(row._index)"
				@click="clickCurrentRow(row._index)"
			>
				<template v-for="(column,colIndex) in columns">
					<Cell
						tag="td"
						v-if="hideWithSpan(colIndex,rowIndex,column,row)"
						:key="column.key"
						:row="row"
						:column="column"
						:index="rowIndex"
						:axis="[colIndex,rowIndex]"
						:render="column.render"
						:class="cellClasses(column)"
						:style="handleStyle(colIndex,rowIndex,column,row)"
						v-bind="getSpans(colIndex,rowIndex,column,row)"
						v-on="cellListeners(column,row)"
					>
						<Checkbox
							v-if="column.type==='selection'"
							:radio="column.isRadio"
							readonly
							:value="isCheck(column.key,row._index)"
							@click.native="handleCheckChange(column,row._index,rowIndex)"
						></Checkbox>
						<template v-else-if="column.type==='index'">{{rowIndex+1}}</template>
						<div
							v-else-if="column.type==='expand'"
							:key="row._index"
							@click="toggleExpand(row._index)"
							:class="expandCls(row._index)"
						>
							<Icons type="ios-arrow-forward"></Icons>
						</div>
						<span v-else-if="column.type === 'html'" v-html="row[column.key]"></span>
						<span v-else-if="column.type === 'template'" v-html="compileTemplate(column,row)"></span>
					
						<template v-else>{{row[column.key]}}</template>
					</Cell>
				</template>
			</tr>
			<tr v-if="rowExpanded(row._index)" :key="'expand'+row._index" :class="[prefix + '-expanded-row']">
				<Cell
					tag="td"
					:colspan="columns.length"
					:class="[prefix + '-expanded-cell']"
					:row="row"
					:render="renderExpand"
					:style="handleExpandStyle(rowIndex)"
					:index="row._index"
				></Cell>
			</tr>
		</template>
	</tbody>
</template>

<script>
import Cell from './render';
import Icons from "../icons/index";
import { unit } from '../../utils/tool';
import Checkbox from "../checkbox/index";

export default {
	name: 'TableBody',
	components: {
		Cell,
		Checkbox,
		Icons
	},
	props: {
		columns: Array,
		data: Array, // rebuildData
		actionData: Object,
		prefix: String,
		isFixed: {
			type: [Boolean, String],
			default: false,
		},
		columnStatus: Object,
		fixedSize: Object,
		layoutFixed: Boolean
	},
	computed: {
		renderExpand() {
			for (let i = 0; i < this.columns.length; i++) {
				const column = this.columns[i];
				if (column._hasExpand) return column.renderExpand;
			}
		},
	},
	methods: {
		cellListeners(column, row){
			if(column.type==='tree'&&Array.isArray(row.children)){
				return {
					click: ()=>this.$parent.toggleTree(row._index)
				}
			}
		},
		rowClasses(_index) {
			const action = this.actionData[_index] || {},
				_tobogPrefix_ = this.prefix;
			return [
				`${_tobogPrefix_}-row`,
				{
					[`${_tobogPrefix_}-row-highlight`]: action._isHighlight,
					[`${_tobogPrefix_}-row-hover`]: action._isHover,
				},
			];
		},
		handleStyle(colIndex, rowIndex,column, row) {
			const style={};
			if(row._childDeep>0&&column.type==='tree') style.paddingLeft=row._childDeep*15+'px';
			if (this.layoutFixed) return style;
			const fixedSize = this.fixedSize;
			if (fixedSize) {
				const [width, height] = fixedSize[`${rowIndex}/${colIndex}`] || [];
					// style = {};
				if (!width || !height) return;
				style.width = style.minWidth = style.maxWidth = unit(width, 'px');
				style.height = style.minHeight = unit(height, 'px');
				// return style
			}
			return style
		},
		handleExpandStyle(rowIndex){
			if (this.layoutFixed) return;
			const fixedSize = this.fixedSize;
			if (fixedSize) {
				const size = (fixedSize[`${rowIndex}/${0}`] || [])[2],
				style = {};
				if(size) style.height = style.minHeight = unit(size[1], 'px');
				return style
			}
		},
		expandCls(index) {
			return [
				`${this.prefix}-cell-expand`,
				{
					[`${this.prefix}-cell-expanded`]: this.rowExpanded(index)
				}
			];
		},
		getSpans(columnIndex, rowIndex, column, row) {
			const curSpans = this._curSpans[`${columnIndex}/${rowIndex}`];
			if (curSpans) return curSpans;
			const fn = column.spanMethod || this.$parent.spanMethod;
			if (typeof fn === 'function') {
				let result = fn.call(this, columnIndex, rowIndex, column, row);
				let rowspan = 1, colspan = 1;
				if (Array.isArray(result)) {
					rowspan = result[1] || undefined;
					colspan = result[0] || undefined;
				} else if (typeof result === 'object') {
					rowspan = result.rowspan || undefined;
					colspan = result.colspan || undefined;
				}
				if (rowspan > 1) {
					const _rowSpans = this._rowSpans[columnIndex];
					if (!_rowSpans || rowIndex > _rowSpans[1]) {
						this._rowSpans[columnIndex] = [rowIndex + 1, rowIndex + rowspan / 1 - 1];
					}
				}
				if (colspan > 1) {
					const _colSpans = this._rowSpans[rowIndex];
					if (!_colSpans || columnIndex < _colSpans[0] || columnIndex > _colSpans[1]) {
						this._colSpans[rowIndex] = [columnIndex + 1, columnIndex + colspan / 1 - 1];
					}
				}
				result = {
					rowspan,
					colspan
				}
				this._curSpans[`${columnIndex}/${rowIndex}`] = result;
			}
		},
		hideWithSpan(columnIndex, rowIndex, column, row) {
			if (columnIndex == 0 && rowIndex == 0) {
				this._colSpans = {};
				this._rowSpans = {};
				this._curSpans = {};
			}
			const spans = this.getSpans(columnIndex, rowIndex, column, row);
			const hideRowSpans = this._rowSpans[columnIndex];
			const hideColSpans = this._colSpans[rowIndex];
			if (hideRowSpans && rowIndex >= hideRowSpans[0] && rowIndex <= hideRowSpans[1]) return false;
			if (hideColSpans && columnIndex >= hideColSpans[0] && columnIndex <= hideColSpans[1]) return false;
			return true;
		},
		cellClasses(column = {}) {
			const _tobogPrefix_ = this.prefix;
			return [
				// `${_tobogPrefix_}-cell`,
				{
					[`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
					[`${_tobogPrefix_}-cell-${column.align}`]: !!column.align,
				},
			];
		},
		toggleExpand(_index) {
			this.$parent.toggleExpand(_index);
		},
		rowExpanded(_index) {
			return this.actionData[_index]._isExpanded;
		},
		isCheck(key, _index) {
			return (this.columnStatus.check[key] || []).some(function (item) {
				return item == _index
			})
		},
		handleCheckChange(column, _index, index) {
			this.$emit('on-column-status', 'check', column, !this.isCheck(column.key, _index), 'select', index);
		},
		handleMouseIn(rowIndex) {
			// if (!this.isFixed) return;
			this.$parent.handleMouseIn(rowIndex);
		},
		handleMouseOut(rowIndex) {
			// if (!this.isFixed) return;
			this.$parent.handleMouseOut(rowIndex);
		},
		clickCurrentRow(_index) {
			this.__clickCount = (this.__clickCount || 0) + 1;
			clearTimeout(this.__clickCountTimeout)
			this.__clickCountTimeout = setTimeout(() => {
				this.$parent.clickCurrentRow(_index, this.__clickCount > 1);
				this.__clickCountTimeout = this.__clickCount = null;
			}, 300)
		},
		compileTemplate(column, row) {
			const template = column.template || column.key;
			if (!template) return;
			return `${template}`.replace(/\{([^{}])+\}/g, function (match, reg) {
				const source = 'with(obj||{}){' + match + '}';
				return (new Function("obj", source))(row);
			})
		},
		// toggleTree(row){
 		// 	this.$parent.toggleTree(row);
		// }	
	},
	beforeDestroy() {
		clearTimeout(this.__clickCountTimeout)
	}
};
</script>
