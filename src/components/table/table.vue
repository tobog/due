<template>
    <section :class="wrapClasses" :style="wrapStyles">
        <div :class="[_tobogPrefix_]" ref="tables">
            <!-- fixed thead -->
            <div
                v-if="isFixHead && showHeader"
                :class="[_tobogPrefix_ + '-fixed-thead']"
                :style="{paddingRight: scrollBarWidth[1] + 4 + 'px'}"
            >
                <div :class="[_tobogPrefix_ + '-fixed-wrapper']" ref="headScroll">
                    <table cellspacing="0" cellpadding="0" border="0" :class="[_tobogPrefix_ + '-table']">
                        <Thead
                            fixed="top"
                            :prefix="_tobogPrefix_"
                            :cellsSize="headCellsSize"
                            :columns="normalColumns"
                            :action-data="actionData"
                            :column-status="columnStatus"
                            :data-length="getResultLen"
                            @on-column-status="handleColumnStatus"
                        ></Thead>
                    </table>
                </div>
            </div>
            <!-- fixed thead -->
            <!-- Tbody -->
            <div :class="[_tobogPrefix_ + '-body']" ref="body">
                <table
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    ref="table"
                    :style="tablePerformanceStyle"
                    :class="[_tobogPrefix_ + '-table']"
                >
                    <Colgroups v-if="!showHeader" :columns="bodyTdSize"></Colgroups>
                    <Thead
                        v-if="showHeader"
                        ref="thead"
                        :prefix="_tobogPrefix_"
                        :columns="normalColumns"
                        :action-data="actionData"
                        :column-status="columnStatus"
                        :data-length="getResultLen"
                        @on-column-status="handleColumnStatus"
                    ></Thead>
                    <Tbody
                        ref="tbody"
                        :prefix="_tobogPrefix_"
                        :columns="cloneColumns"
                        :data="rebuildData"
                        :hoverRowIndex="hoverRowIndex"
                        :indentSize="indentSize"
                        :spanMethod="spanMethod"
                        :action-data="actionData"
                        :column-status="columnStatus"
                        @on-column-status="handleColumnStatus"
                    ></Tbody>
                    <Summary
                        v-if="showSummary && getResultLen"
                        ref="summary"
                        :prefix="_tobogPrefix_"
                        :columns="cloneColumns"
                        :class="[
                            _tobogPrefix_ + '-summary-body',
                            (isFixSummary && _tobogPrefix_ + '-summary-hide') || '',
                        ]"
                        :data="summaryData"
                    ></Summary>
                </table>
                <div v-if="!getResultLen" :class="[_tobogPrefix_ + '-tip']" :style="getNoDataHeight">
                    <slot name="tip">{{ getNoDataText }}</slot>
                </div>
            </div>
            <!-- Tbody -->
            <!-- fixSummary -->
            <div
                v-if="isFixSummary"
                ref="summaryScroll"
                :class="[_tobogPrefix_ + '-summary', _tobogPrefix_ + '-summary-fixed']"
                :style="getSummaryStyle"
            >
                <table cellspacing="0" cellpadding="0" border="0" :class="[_tobogPrefix_ + '-table']">
                    <Summary
                        :prefix="_tobogPrefix_"
                        :fixedSize="summaryTdSize"
                        :columns="cloneColumns"
                        :class="[_tobogPrefix_ + '-summary-body']"
                        :data="summaryData"
                    ></Summary>
                </table>
            </div>
            <!-- fixSummary -->
            <!-- left fixed -->
            <div v-if="isLeftFixed && leftFixedSize" :class="[_tobogPrefix_ + '-left-fixed']">
                <div
                    :class="[_tobogPrefix_ + '-left-fixed-head']"
                    v-if="isFixHead && showHeader"
                    :style="fixedHeadStyle"
                >
                    <table cellspacing="0" cellpadding="0" border="0" :class="[_tobogPrefix_ + '-table']">
                        <Thead
                            fixed="left"
                            :prefix="_tobogPrefix_"
                            :columns="leftFixedColumnRows"
                            :cellsSize="headCellsSize"
                            :action-data="actionData"
                            :column-status="columnStatus"
                            :data-length="getResultLen"
                            @on-column-status="handleColumnStatus"
                        ></Thead>
                    </table>
                </div>
                <div :class="[_tobogPrefix_ + '-left-fixed-wrapper']" :style="hidenLeftScroll">
                    <div
                        v-if="getResultLen"
                        ref="leftScroll"
                        :class="[_tobogPrefix_ + '-fixed-wrapper']"
                        :style="leftFixedBodyStyle"
                    >
                        <table
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            :style="tablePerformanceStyle"
                            :class="[_tobogPrefix_ + '-table']"
                        >
                            <Thead
                                v-if="!isFixHead && showHeader"
                                fixed="left"
                                :prefix="_tobogPrefix_"
                                :columns="leftFixedColumnRows"
                                :cellsSize="headCellsSize"
                                :action-data="actionData"
                                :column-status="columnStatus"
                                :data-length="getResultLen"
                                @on-column-status="handleColumnStatus"
                            ></Thead>
                            <Tbody
                                v-if="getResultLen"
                                fixed="left"
                                :isFixed="isFixed"
                                :fixedSize="leftFixedSize"
                                :prefix="_tobogPrefix_"
                                :columns="leftFixedColumns"
                                :data="rebuildData"
                                :hoverRowIndex="hoverRowIndex"
                                :indentSize="indentSize"
                                :spanMethod="spanMethod"
                                :action-data="actionData"
                                :column-status="columnStatus"
                                @on-column-status="handleColumnStatus"
                            ></Tbody>
                            <Summary
                                fixed="left"
                                v-if="isInnerSummary"
                                :prefix="_tobogPrefix_"
                                :class="[
                                    _tobogPrefix_ + '-summary-body',
                                    (isFixSummary && _tobogPrefix_ + '-summary-hide') || '',
                                ]"
                                :columns="leftFixedColumns"
                                :data="summaryData"
                            ></Summary>
                        </table>
                    </div>
                </div>
                <div v-if="isFixSummary" :class="[_tobogPrefix_ + '-summary', _tobogPrefix_ + '-summary-fixed-left']">
                    <table cellspacing="0" cellpadding="0" border="0" :class="[_tobogPrefix_ + '-table']">
                        <Summary
                            :prefix="_tobogPrefix_"
                            :fixedSize="summaryTdSize"
                            :columns="leftFixedColumns"
                            :class="[_tobogPrefix_ + '-summary-body']"
                            :data="summaryData"
                        ></Summary>
                    </table>
                </div>
            </div>
            <!-- left fixed -->
            <!-- right fixed -->
            <div v-if="isRightFixed && rightFixedSize" :class="[_tobogPrefix_ + '-right-fixed']">
                <div
                    :class="[_tobogPrefix_ + '-right-fixed-head']"
                    v-if="isFixHead && showHeader"
                    :style="rightFixedHeadStyle"
                >
                    <table cellspacing="0" cellpadding="0" border="0" :class="[_tobogPrefix_ + '-table']">
                        <Thead
                            fixed="right"
                            :prefix="_tobogPrefix_"
                            :columns="rightFixedColumnRows"
                            :cellsSize="headCellsSize"
                            :rightIndex="getRightIndex"
                            :action-data="actionData"
                            :column-status="columnStatus"
                            :data-length="getResultLen"
                            @on-column-status="handleColumnStatus"
                        ></Thead>
                    </table>
                </div>
                <div
                    v-if="getResultLen"
                    ref="rightScroll"
                    :style="rightFixedBodyStyle"
                    :class="[_tobogPrefix_ + '-fixed-wrapper']"
                >
                    <table
                        :style="tablePerformanceStyle"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        :class="[_tobogPrefix_ + '-table']"
                    >
                        <Thead
                            v-if="!isFixHead && showHeader"
                            fixed="right"
                            :prefix="_tobogPrefix_"
                            :columns="rightFixedColumnRows"
                            :cellsSize="headCellsSize"
                            :rightIndex="getRightIndex"
                            :action-data="actionData"
                            :column-status="columnStatus"
                            :data-length="getResultLen"
                            @on-column-status="handleColumnStatus"
                        ></Thead>
                        <Tbody
                            v-if="getResultLen"
                            fixed="right"
                            :isFixed="isFixed"
                            :fixedSize="rightFixedSize"
                            :prefix="_tobogPrefix_"
                            :columns="rightFixedColumns"
                            :data="rebuildData"
                            :hoverRowIndex="hoverRowIndex"
                            :indentSize="indentSize"
                            :spanMethod="spanMethod"
                            :action-data="actionData"
                            :column-status="columnStatus"
                            @on-column-status="handleColumnStatus"
                        ></Tbody>
                        <Summary
                            v-if="isInnerSummary"
                            fixed="right"
                            :prefix="_tobogPrefix_"
                            :class="[
                                _tobogPrefix_ + '-summary-body',
                                (isFixSummary && _tobogPrefix_ + '-summary-hide') || '',
                            ]"
                            :columns="rightFixedColumns"
                            :data="summaryData"
                        ></Summary>
                    </table>
                </div>
                <div
                    v-if="isFixSummary"
                    :class="[_tobogPrefix_ + '-summary', _tobogPrefix_ + '-summary-fixed-right']"
                    :style="getSummaryStyle"
                >
                    <table cellspacing="0" cellpadding="0" border="0" :class="[_tobogPrefix_ + '-table']">
                        <Summary
                            :prefix="_tobogPrefix_"
                            :fixedSize="rightFixedSummarySize"
                            :columns="rightFixedColumns"
                            :class="[_tobogPrefix_ + '-summary-body']"
                            :data="summaryData"
                        ></Summary>
                    </table>
                </div>
            </div>
            <!-- right fixed -->
        </div>
        <div v-if="dragableLine" :class="[_tobogPrefix_ + '-resize-line']" :style="{left: dragableLine + 'px'}"></div>
        <Tooltip
            :reference="tooltip.reference"
            trigger="hover"
            gpu
            placement="top-center"
            offset="10"
            v-if="tooltip.show"
        >
            <div :class="[_tobogPrefix_ + '-tooltip']" slot="content" v-html="tooltip.content"></div>
        </Tooltip>
    </section>
</template>

<script>
import Mixin from "./mixin"
import {debounce} from "../../utils/tool"
export default {
    name: "Table",
    mixins: [Mixin],
    data() {
        return {
            ready: false,
            headCellsSize: {},
            headSize: [0, 0],
            bodySize: [0, 0, 0],
            summaryTdSize: {},
            leftFixedSize: {},
            rightFixedSize: {},
            bodyTdSize: [],
            tooltip: {
                show: false,
            },
        }
    },
    created() {
        this.initSizes = debounce(() => {
            this.getDefaultWidth()
            this.$nextTick(() => {
                this.getBodySizes()
                this.getBodyCellHeight()
                this.getSummarySize()
            })
        }, 60)
    },
    computed: {
        getNoDataHeight() {
            const height = parseFloat("0" + this.height)
            if (height <= 0) return
            return {
                height: (this.bodySize[1] || height) - this.headSize[1] - 16 + "px",
            }
        },
        tablePerformanceStyle() {
            if (!this.isPerformance) return
            if (this.translateSize > 0)
                return {
                    transform: `translateY(${this.translateSize}px)`,
                }
            return {}
        },
        rightFixedBodyStyle() {
            const height = this.isFixHead ? this.bodySize[1] - this.headSize[1] : this.bodySize[1]
            return {
                maxHeight: height + "px",
                width: this.getRightWidth + this.scrollBarWidth[1] + "px",
                paddingBottom: this.summarySize[1] + "px",
            }
        },
        leftFixedBodyStyle() {
            const height = this.isFixHead ? this.bodySize[1] - this.headSize[1] : this.bodySize[1]
            // console.log(this.scrollBarWidth[1])
            return {
                maxHeight: height + "px",
                width: this.getLeftWidth + this.scrollBarWidth[1] + 1 + "px",
                paddingBottom: this.summarySize[1] + "px",
            }
        },
        fixedTopStyle() {
            return {
                width: this.bodySize[0] + "px",
            }
        },
        fixedHeadStyle() {
            return {
                height: this.headSize[1] + "px",
            }
        },
        rightFixedHeadStyle() {
            return {
                height: this.headSize[1] + "px",
                paddingRight: this.scrollBarWidth[1] + "px",
            }
        },
        getRightIndex() {
            const rightLen = this.rightFixedColumnRows.map((arr) => arr.length)
            return this.normalColumns.map((arr, index) => arr.length - (rightLen[index] || 0))
        },
        leftFixedColumns() {
            return this.cloneColumns.filter((col) => col.fixed === "left")
        },
        rightFixedColumns() {
            return this.cloneColumns.filter((col) => col.fixed === "right")
        },
        leftFixedColumnRows() {
            if (this.isColumnRows) {
                return this.columnRows.map((arr) => {
                    return arr.filter((col) => col.fixed === "left")
                })
            } else {
                return [this.leftFixedColumns]
            }
        },
        rightFixedColumnRows() {
            if (this.isColumnRows) {
                return this.columnRows.map((arr) => {
                    return arr.filter((col) => col.fixed === "right")
                })
            } else {
                return [this.rightFixedColumns]
            }
        },
        rightFixedSummarySize() {
            let summaryTdSize = {},
                index = 0
            for (let key in this.summaryTdSize) {
                const val = this.summaryTdSize[key]
                if (val[2] === "right") {
                    summaryTdSize[`${0}/${index++}`] = val
                }
            }
            return summaryTdSize
        },
        hidenLeftScroll() {
            return {
                width: this.getLeftWidth + 0.8 + "px",
            }
        },
        getLeftWidth() {
            const fixedSize = this.leftFixedSize
            const totalWidth = Object.keys(fixedSize).reduce((total, cur, index, arr) => {
                if (cur.indexOf("0/") == 0) {
                    return total + fixedSize[cur][0]
                }
                return total
            }, 0)
            return totalWidth
        },
        getRightWidth() {
            const fixedSize = this.rightFixedSize
            const totalWidth = Object.keys(fixedSize).reduce((total, cur, index, arr) => {
                if (cur.indexOf("0/") == 0) {
                    return total + fixedSize[cur][0]
                }
                return total
            }, 0)
            return totalWidth
        },
        getSummaryStyle() {
            if (!this.fixSummary || !this.showSummary) return
            const style = {}
            if (this.scrollBarWidth[0]) style.bottom = this.scrollBarWidth[0] + "px"
            if (this.scrollBarWidth[1]) style.right = this.scrollBarWidth[1] + "px"
            return style
        },
    },
    methods: {
        // initSizes() {
        //     this.$nextTick(() => {
        //         this.getDefaultWidth();
        //         AnimationFrame.requestFrame(() => {
        //             this.getBodySizes();
        //             this.getBodyCellHeight();
        //             this.getSummarySize();
        //         });
        //     });
        // },
        getBodySizes() {
            const {body, thead} = this.$refs
            const theadEle = thead && thead.$el
            if (this.isLayoutFixed) {
                const rowNodes = (theadEle && theadEle.querySelectorAll("tr")) || []
                const headCellsSize = {}
                rowNodes.forEach((row, rowIndex) => {
                    const children = [...row.children]
                    children.forEach((cell, colIndex) => {
                        headCellsSize[`${rowIndex}/${colIndex}`] = this._handleSize(cell)
                    })
                })
                this.headCellsSize = headCellsSize
            }
            this.headSize = (theadEle && this._handleSize(theadEle, 0.8)) || []
            this.bodySize = [body.clientWidth, body.clientHeight, body.scrollWidth, body.scrollHeight]
            this.setSrollSize()
            this.ready = true
        },
        getBodyCellHeight() {
            if (!this.isFixed) return
            const tbody = this.$refs.tbody,
                tbodyEle = tbody.$el,
                _tobogPrefix_ = this._tobogPrefix_,
                rowNodes = tbodyEle.querySelectorAll(`tr.${_tobogPrefix_}-row`),
                leftFixedSize = {},
                rightFixedSize = {},
                isLeftFixed = this.isLeftFixed,
                isRightFixed = this.isRightFixed,
                leftLength = this.leftFixedColumns.length,
                rightLength = this.rightFixedColumns.length
            rowNodes.forEach((row,rowIndex) => {
                const children = [...row.children],
                    // index = row.dataset.index,
                    leftChildren = isLeftFixed ? children.slice(0, leftLength) : [],
                    rightChildren = isRightFixed ? children.slice(children.length - rightLength) : []
                leftChildren.forEach((cell, colIndex) => {
                    leftFixedSize[`${rowIndex}/${colIndex}`] = this._handleSize(cell, 0.8)
                })
                rightChildren.forEach((cell, colIndex) => {
                    rightFixedSize[`${rowIndex}/${colIndex}`] = this._handleSize(cell, 0.8)
                })
                const nextEle = row.nextElementSibling
                if (nextEle && nextEle.classList.contains(`${_tobogPrefix_}-expanded-row`)) {
                    const expandSize = this._handleSize(nextEle)
                    expandSize[1] = expandSize[1] - 1
                    leftFixedSize[`${rowIndex}/${0}`] && leftFixedSize[`${rowIndex}/${0}`].push(expandSize)
                    rightFixedSize[`${rowIndex}/${0}`] && rightFixedSize[`${rowIndex}/${0}`].push(expandSize)
                }
            })

            this.leftFixedSize = leftFixedSize
            this.rightFixedSize = rightFixedSize
        },
        getDefaultWidth() {
            if (this.showHeader) return
            this.bodyTdSize = this.cloneColumns.map((cell) => {
                return {width: cell.width, fixed: cell.fixed}
            }, 0)
        },
        getSummarySize() {
            if (this.fixSummary && this.showSummary && this.getResultLen) {
                const summary = this.$refs.summary
                const summaryTdSize = {}
                if (!summary) return
                if (this.isFixSummary) this.summarySize = this._handleSize(summary.$el)
                const tr = summary.$el.querySelector("tr")
                tr.children.forEach((cell, colIndex) => {
                    summaryTdSize[`${0}/${colIndex}`] = this._handleSize(cell, 0.8)
                    const dataFixed = cell.dataset.fixed
                    if (dataFixed) summaryTdSize[`${0}/${colIndex}`].push(dataFixed)
                })
                this.summaryTdSize = summaryTdSize
            }
        },
    },
}
</script>
