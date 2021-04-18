<template>
    <tbody>
        <template v-for="(row, rowIndex) in data">
            <tr
                :key="row._index + (row._isChild ? '@child' : '')"
                :data-index="row._index"
                :data-row-index="rowIndex"
                :class="rowClasses(row)"
                @mouseenter="handleMouseIn(row._index)"
                @mouseleave="handleMouseOut(row._index)"
                @click="clickCurrentRow(row._index)"
            >
                <template v-for="(column, colIndex) in columns">
                    <Cell
                        tag="td"
                        v-if="hideWithSpan(row._index, colIndex, rowIndex, column, row)"
                        :key="column.key"
                        :row="row"
                        :column="column"
                        :index="row._index"
                        :axis="[colIndex, rowIndex]"
                        :render="column.render"
                        :class="cellClasses(column)"
                        :style="handleStyle(colIndex, rowIndex, column, row)"
                        v-bind="getSpans(row._index, colIndex, rowIndex, column, row)"
                        v-on="cellListeners(column, row)"
                    >
                        <Checkbox
                            v-if="column.type === 'selection'"
                            :radio="column.isRadio"
                            readonly
                            :value="isCheck(column.key, row._index)"
                            @click.native="handleCheckChange(column, row._index, rowIndex)"
                        ></Checkbox>
                        <template v-else-if="column.type === 'index'">{{ rowIndex + 1 }}</template>
                        <div
                            v-else-if="column.type === 'expand'"
                            :key="row._index"
                            @click="toggleExpand(row._index)"
                            :class="expandCls(row._index)"
                        >
                            <Icons :class="[prefix + '-arrow-icon']" type="ios-arrow-forward"></Icons>
                        </div>
                        <span v-else-if="column.type === 'html'" v-html="row[column.key]"></span>
                        <span v-else-if="column.type === 'template'" v-html="compileTemplate(column, row)"></span>
                        <template v-else-if="hasChildren(column, row)">
                            <Icons
                                :class="[prefix + '-children-icon']"
                                :data-loading="row._loading"
                                :type="row._loading ? 'loading' : row._isShowChildren ? 'ios-remove' : 'ios-add'"
                            ></Icons>
                            <span>{{ row[column.key] }}</span>
                        </template>
                        <template v-else>{{ row[column.key] }}</template>
                    </Cell>
                </template>
            </tr>
            <tr
                v-if="rowExpanded(row._index)"
                @mouseenter="handleMouseIn(row._index + '@expanded')"
                @mouseleave="handleMouseOut(row._index + '@expanded')"
                :key="'expand' + row._index"
                :class="expandClasses(row._index)"
                :data-index="row._index + '@expanded'"
                :data-row-index="rowIndex + '@expanded'"
            >
                <Cell
                    tag="td"
                    :colspan="columns.length"
                    :class="[prefix + '-expanded-cell']"
                    :row="row"
                    :index="row._index + '@expanded'"
                    :axis="[0, rowIndex + '@expanded']"
                    :render="renderExpand"
                    :style="handleExpandStyle(rowIndex)"
                ></Cell>
            </tr>
        </template>
    </tbody>
</template>

<script>
import Cell from "./render"
import Icons from "../icons/src/index"
import {unit} from "../../utils/tool"
import Checkbox from "../checkbox/index"

export default {
    name: "TableBody",
    components: {
        Cell,
        Checkbox,
        Icons,
    },
    props: {
        columns: Array,
        data: Array, // rebuildData
        actionData: Object,
        prefix: String,
        fixed: String,
        isFixed: {
            type: [Boolean, String],
            default: false,
        },
        columnStatus: Object,
        fixedSize: Object,
        layoutFixed: Boolean,
        fixedStyle: Array,
        hoverRowIndex: [Number, String],
        indentSize: [Number, String],
        spanMethod: Function,
    },
    computed: {
        renderExpand() {
            for (let i = 0; i < this.columns.length; i++) {
                const column = this.columns[i]
                if (column._hasExpand) return column.renderExpand
            }
            return null
        },
    },
    methods: {
        hasChildren(column, row) {
            return column.type === "children" && Array.isArray(row.children)
        },
        cellListeners(column, row) {
            if (this.hasChildren(column, row)) {
                return {
                    click: () => this.$parent.toggleTree(row._index),
                }
            }
        },
        expandClasses(_index) {
            const _tobogPrefix_ = this.prefix
            return [
                `${_tobogPrefix_}-expanded-row`,
                {
                    [`${_tobogPrefix_}-row-hover`]: this.hoverRowIndex === _index + "@expanded",
                },
            ]
        },
        rowClasses(row) {
            const action = this.actionData[row._index] || {},
                _tobogPrefix_ = this.prefix
            return [
                `${_tobogPrefix_}-row`,
                {
                    [`${_tobogPrefix_}-row-highlight`]: action._isHighlight,
                    [`${_tobogPrefix_}-row-hover`]: this.hoverRowIndex === row._index,
                    [`${_tobogPrefix_}-row-child`]: row._isChild,
                    [`${_tobogPrefix_}-row-children`]: row._isShowChildren,
                },
            ]
        },
        handleStyle(colIndex, rowIndex, column, row) {
            const style = {}
            const indentSize = column.indentSize || this.indentSize || 20
            if (row._childDeep > 0 && column.type === "children") style.paddingLeft = row._childDeep * indentSize + "px"
            if (this.layoutFixed) return style
            const fixedSize = this.fixedSize
            if (fixedSize) {
                const [width, height] = fixedSize[`${rowIndex}/${colIndex}`] || []
                if (!width || !height) return
                style.width = style.minWidth = style.maxWidth = unit(width, "px")
                style.height = style.minHeight = unit(height, "px")
            }
            return style
        },
        handleExpandStyle(rowIndex) {
            const style = {}
            if (!this.isFixed && this.fixedStyle) {
                if (this.fixedStyle && this.fixedStyle[0] > 0) {
                    style.paddingLeft = this.fixedStyle[0] + 2 + "px"
                }
                if (this.fixedStyle && this.fixedStyle[1] > 0) {
                    style.paddingRight = this.fixedStyle[1] + 2 + "px"
                }
            }
            if (this.layoutFixed) return style
            const fixedSize = this.fixedSize
            if (fixedSize) {
                const size = (fixedSize[`${rowIndex}/${0}`] || [])[2]
                if (size) style.height = style.minHeight = unit(size[1], "px")
                return style
            }
            return style
        },
        expandCls(index) {
            return [
                `${this.prefix}-cell-expand`,
                {
                    [`${this.prefix}-cell-expanded`]: this.rowExpanded(index),
                },
            ]
        },
        getSpans(index, colIndex, rowIndex, column, row) {
            const curSpans = this._curSpans[`${colIndex}/${index}`]
            if (curSpans) return curSpans
            const fn = column.spanMethod || this.spanMethod
            if (typeof fn === "function") {
                const result = fn.call(this, {index, columnIndex: colIndex, rowIndex}, column, row)
                let rowspan = 1,
                    colspan = 1
                if (Array.isArray(result)) {
                    rowspan = result[1] || void 0
                    colspan = result[0] || void 0
                } else if (typeof result === "object") {
                    rowspan = result.rowspan || void 0
                    colspan = result.colspan || void 0
                }
                if (rowspan > 1) {
                    const _rowSpans = this._rowSpans[colIndex]
                    if (!_rowSpans || index > _rowSpans[1]) {
                        this._rowSpans[colIndex] = [index + 1, rowspan - 1 + index]
                        if (colspan > 1) {
                            for (let index = 1; index < colspan; index++) {
                                this._rowSpans[colIndex + index] = this._rowSpans[colIndex]
                            }
                        }
                    }
                }
                if (colspan > 1) {
                    const _colSpans = this._colSpans[index]
                    if (!_colSpans || colIndex < _colSpans[0] || colIndex > _colSpans[1]) {
                        this._colSpans[index] = [colIndex + 1, colspan - 1 + colIndex]
                        if (rowspan > 1) {
                            for (let index = 1; index < rowspan; index++) {
                                this._colSpans[index + index] = this._colSpans[index]
                            }
                        }
                    }
                }
                if (colspan > 1 || rowspan > 1) {
                    this._curSpans[`${colIndex}/${index}`] = {
                        rowspan,
                        colspan,
                    }
                }
            }
        },
        hideWithSpan(index, colIndex, rowIndex, column, row) {
            if (colIndex == 0 && rowIndex == 0) {
                this._colSpans = {}
                this._rowSpans = {}
                this._curSpans = {}
            }
            this.getSpans(index, colIndex, rowIndex, column, row)
            const hideRowSpans = this._rowSpans[colIndex]
            const hideColSpans = this._colSpans[index]
            if (
                (hideRowSpans && index >= hideRowSpans[0] && index <= hideRowSpans[1]) ||
                (hideColSpans && colIndex >= hideColSpans[0] && colIndex <= hideColSpans[1])
            )
                return false
            return true
        },
        cellClasses(column = {}) {
            const _tobogPrefix_ = this.prefix
            return [
                `${_tobogPrefix_}-cell`,
                {
                    [`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
                    [`${_tobogPrefix_}-cell-${column.align}`]: !!column.align,
                },
            ]
        },
        toggleExpand(_index) {
            this.$parent.toggleExpand(_index)
        },
        rowExpanded(_index) {
            return this.actionData[_index]._isExpanded
        },
        isCheck(key, _index) {
            return (this.columnStatus.check[key] || []).some(function(item) {
                return item == _index
            })
        },
        handleCheckChange(column, _index, index) {
            this.$emit("on-column-status", "check", column, !this.isCheck(column.key, _index), "select", index)
        },
        handleMouseIn(rowIndex) {
            this.$parent.handleMouseIn(rowIndex)
        },
        handleMouseOut(rowIndex) {
            this.$parent.handleMouseOut(rowIndex)
        },
        clickCurrentRow(_index) {
            this.__clickCount = (this.__clickCount || 0) + 1
            clearTimeout(this.__clickCountTimeout)
            this.__clickCountTimeout = setTimeout(() => {
                this.$parent.clickCurrentRow(_index, this.__clickCount > 1)
                this.__clickCountTimeout = this.__clickCount = null
            }, 300)
        },
        compileTemplate(column, row) {
            const template = column.template || column.key
            if (!template) return
            return `${template}`.replace(/\{\{([^\{\}]+)\}\}/g, function(match, reg) {
                // console.log(match, reg, "compileTemplate")
                try {
                    return new Function("obj", "with(obj||{}){return " + reg + "}")({...column.data, ...row})
                } catch (error) {
                    console.log(error)
                    return match
                }
            })
        },
    },
    beforeDestroy() {
        clearTimeout(this.__clickCountTimeout)
    },
}
</script>
