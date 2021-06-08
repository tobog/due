<template>
    <thead>
        <tr v-if="cols.length" v-for="(cols, rowIndex) in columns" :key="rowIndex">
            <Cell
                v-for="(column, colIndex) in cols"
                tag="th"
                :key="colIndex"
                :column="column"
                :colspan="column.colSpan"
                :rowspan="column.rowSpan"
                :title="column.desc"
                :class="cellClasses(column)"
                :index="colIndex"
                :axis="[colIndex, rowIndex]"
                :style="handleStyle(column, colIndex, rowIndex)"
                @mouseenter.native.stop="showToolTip(column, $event)"
            >
                <span :class="[prefix + '-title']">{{ column.title }}</span>
                <Sort
                    v-if="column.sortable && column.key"
                    :sort="columnStatus.sort[column.key]"
                    :class="[prefix + '-sort']"
                    @on-change="(sort) => handleSortChange(sort, column)"
                ></Sort>
                <Checkbox
                    v-if="column.type === 'selection' && !column.isRadio"
                    :class="[prefix + '-checkbox']"
                    :value="isCheckAll(column.key)"
                    :disabled="!dataLength"
                    readonly
                    @click.native="handleCheckChange(column)"
                ></Checkbox>
                <Dropdown
                    v-if="(column.filters || []).length > 0"
                    placement="bottom-center"
                    :class="[prefix + '-filter-wrapper']"
                    :data-active="!!columnStatus.filter[column.key]"
                    :label="columnStatus.filter[column.key]"
                    @on-change="(value) => handleFilterChange(value, column)"
                    autoClose
                >
                    <Icons type="ios-funnel" :class="[prefix + '-filter-icon']"></Icons>
                    <template slot="list">
                        <DropdownItem
                            v-for="(filter, key) in column.filters"
                            :key="key"
                            :name="filter.value"
                            :class="[prefix + '-filter']"
                        >
                            {{ filter.label }}
                        </DropdownItem>
                    </template>
                </Dropdown>
                <span
                    v-if="column.resizable"
                    @mousedown="getSplitTarget(column, $event)"
                    :class="[prefix + '-splitbar']"
                >
                </span>
            </Cell>
        </tr>
    </thead>
</template>

<script>
import Cell from "./render.js";
import Sort from "../sort/index";
import Dropdown from "../dropdown/index";
import DropdownItem from "../dropdown/src/dropdownItem";
import Icons from "../icons/src/index";
import Checkbox from "../checkbox/src/index";
import { DragMove } from "../../utils/dom";
import { unit } from "../../utils/tool";
export default {
    name: "TableHead",
    components: {
        Cell,
        Sort,
        Checkbox,
        Dropdown,
        Icons,
        DropdownItem,
    },
    props: {
        fixed: {
            type: [Boolean, String],
            default: false,
        },
        cellsSize: Object,
        columns: Array,
        prefix: String,
        actionData: Object,
        columnStatus: Object,
        dataLength: Number,
        rightIndex: Array,
        layoutFixed: Boolean,
    },
    methods: {
        handleStyle(column, colIndex, rowIndex) {
            if (this.layoutFixed) return;
            const cellsSize = this.cellsSize,
                style = {};
            if (cellsSize) {
                if (this.fixed === "left") {
                    const [width, height] = cellsSize[`${rowIndex}/${colIndex}`] || [];
                    if (!width || !height) return;
                    style.width = style.minWidth = style.maxWidth = unit(width, "px");
                    style.height = style.minHeight = style.maxHeight = unit(height, "px");
                } else if (this.fixed === "right") {
                    const rightIndex = this.rightIndex[rowIndex] || 0;
                    const [width, height] = cellsSize[`${rowIndex}/${rightIndex + colIndex}`] || [];
                    if (!width || !height) return;
                    style.width = style.minWidth = style.maxWidth = unit(width, "px");
                    style.height = style.minHeight = style.maxHeight = unit(height, "px");
                } else if (this.fixed === "top") {
                    const [width] = cellsSize[`${rowIndex}/${colIndex}`] || [];
                    if (!width) return;
                    style.width = style.minWidth = style.maxWidth = unit(width, "px");
                }
                return style;
            }
            const { minWidth, maxWidth, width } = column;
            if (minWidth && minWidth != 0) {
                style.minWidth = unit(minWidth, "px");
            }
            if (maxWidth && maxWidth != 0) {
                style.maxWidth = unit(maxWidth, "px");
            }
            if (width && width != 0) {
                style.width = style.minWidth = style.maxWidth = unit(width, "px");
            }
            return style;
        },
        handleSortChange(sort, column) {
            this.$emit("on-column-status", "sort", sort, column);
        },
        isCheckAll(key) {
            return this.dataLength != 0 && (this.columnStatus.check[key] || "").length === this.dataLength;
        },
        handleCheckChange(column) {
            this.$emit("on-column-status", "check", column, !this.isCheckAll(column.key), "selectAll");
        },
        handleFilterChange(filter, column) {
            this.$emit("on-column-status", "filter", filter, column);
        },
        cellClasses(column, value) {
            const _tobogPrefix_ = this.prefix;
            return [
                `${_tobogPrefix_}-cell`,
                {
                    [`${_tobogPrefix_}-cell-ellipsis`]: !!column.ellipsis,
                    [`${_tobogPrefix_}-cell-${column.align}`]: !!column.align,
                },
            ];
        },
        getSplitTarget(column, event) {
            const target = event.currentTarget.parentNode;
            if ((this._DragMove && this._splitTarget !== target) || this._DragMove) {
                this._DragMove.update(target);
                return;
            }
            this._splitTarget = target;
            this._DragMove = new DragMove(
                target,
                { style: ["width"], cursor: " col-resize", boundaryElement: this.$parent.$el, boundaryCalc: false },
                (obj) => {
                    const { distance, data, cancel, boundaryPosition } = obj;
                    if (column.resizable !== "auto" && !cancel) {
                        this.$parent.setSplitWidth(null, null, boundaryPosition);
                    } else {
                        this.$parent.setSplitWidth(column, parseFloat(data.width) + distance[0]);
                    }
                    console.log(obj);

                    if (cancel) {
                        this._DragMove.destroy();
                        this._DragMove = this._splitTarget = null;
                    }
                }
            );
        },
        showToolTip(column, event) {
            if (column.tooltip)
                this.$parent.tooltip = {
                    show: true,
                    reference: event.currentTarget.firstChild,
                    content: column.tooltip,
                };
        },
        // hideToolTip() {
        //     this.$parent.tooltip = {
        //         show: false,
        //     };
        // },
    },
    beforeDestroy() {
        this._DragMove && this._DragMove.destroy();
        this._DragMove = null;
    },
};
</script>
