import {getAllColumns, convertToRows, convertColumnOrder} from "./utils/columns"
import {unit, deepCopy} from "../../utils/tool"
import {
    getScrollBarSize,
    EventListener,
    ScrollSync,
    AnimationFrame,
    getStyles,
    PerformanceScroll,
} from "../../utils/dom"
import Thead from "./thead"
import Summary from "./summary"
import Tbody from "./tbody"
import Tooltip from "../tooltip/index"
import langMinix from "../../mixins/lang"
import Colgroups from "./colgroups"
export default {
    mixins: [langMinix],
    components: {
        Thead,
        Tbody,
        Tooltip,
        Summary,
        Colgroups,
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            },
        },
        columns: {
            type: Array,
            default() {
                return []
            },
        },
        width: Number,
        height: Number,
        stripe: Boolean,
        border: String,
        size: String,
        showHeader: {
            type: Boolean,
            default: true,
        },
        highlightRow: Boolean,
        hover: Boolean,
        ellipsis: Boolean,
        fixHeader: Boolean,
        noDataText: {
            type: String,
            // default: '暂时没有相关数据',
            default: void 0,
        },
        performance: {
            type: String,
            default: "auto", //none,auto,middle,high
        },
        multiExpand: Boolean,
        baseLength: {
            type: Number,
            default: 12,
        },
        showSummary: Boolean,
        isLayoutAuto: Boolean,
        fixSummary: Boolean,
        asyncData: Function,
        sumText: {
            type: String,
            // default: "合计"
            default: void 0,
        },
        align: String, //center left,right,
        indentSize: Number,
        spanMethod: Function,
    },
    data() {
        return {
            ready: false,
            actionData: [],
            rebuildData: [],
            resultData: [],
            cloneColumns: [],
            columnRows: [],
            cloneData: [],
            columnStatus: {
                sort: {},
                filter: {},
                check: {},
            },
            sizeIndex: 0,
            sizeLength: this.baseLength * 2,
            scrollBarWidth: [0, 0], //[x,y]
            bodySize: [],
            translateSize: 0,
            layoutFixed: false,
            summarySize: [0, 0],
            tooltip: {
                show: false,
            },
            hoverRowIndex: -1,
            dragableLine: null,
        }
    },
    created() {
        this.cloneColumns = this.makeColumns()
        this.columnRows = this.makeColumnRows()
        this.actionData = this.makeActionData()
        this.cloneData = this.resultData = this.makeData()
        this.init()
        this.rebuildData = this.getSizeData
    },
    mounted() {
        this.initSizes()
        this.setScrollSync()
        this.initPerformanceScroll()
        EventListener.on(window, "resize", this.initSizes)
    },
    activated() {
        this.initSizes()
        EventListener.on(window, "resize", this.initSizes)
    },
    deactivated() {
        EventListener.off(window, "resize", this.initSizes)
    },
    computed: {
        isLayoutFixed() {
            return (this.isFixHead && this.showHeader) || this.isFixed
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-${this.size}`]: !!this.size,
                    [`${_tobogPrefix_}-ready`]: this.ready,
                    [`${_tobogPrefix_}-stripe`]: this.stripe,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-align-${this.align}`]: !!this.align,
                    [`${_tobogPrefix_}-${this.border}`]: !!this.border,
                    [`${_tobogPrefix_}-ellipsis`]: this.ellipsis,
                    [`${_tobogPrefix_}-layout-auto`]: this.isLayoutAuto && !this.isLayoutFixed,
                    [`${_tobogPrefix_}-fix-summary`]: this.isFixSummary,
                    [`${_tobogPrefix_}-fix-header`]: this.isFixHead && this.showHeader,
                },
            ]
        },
        getSizeData() {
            if (this.initPerformance === "middle") return this.resultData.slice(0, this.sizeIndex + this.sizeLength)
            if (this.initPerformance === "high")
                return this.resultData.slice(this.sizeIndex, this.sizeIndex + this.sizeLength)
            return this.resultData
        },
        getResultLen() {
            return this.resultData.length
        },
        isFixHead() {
            return this.fixHeader && parseFloat(this.height) > 0
        },
        wrapStyles() {
            const height = unit(this.height, "px")
            return height ? {height} : {}
        },
        isPerformance() {
            return (
                (this.initPerformance === "middle" || this.initPerformance === "high") &&
                this.baseLength < this.resultData.length
            )
        },
        initPerformance() {
            const performance = this.performance
            if (performance === "auto") {
                const length = this.resultData.length
                if (length < 200) return "normal"
                if (length < 500) return "middle"
                return "high"
            }
            return performance
        },
        normalColumns() {
            return this.isColumnRows ? this.columnRows : [this.cloneColumns]
        },
        isFixed() {
            return this.isLeftFixed || this.isRightFixed
        },
        isLeftFixed() {
            return this.cloneColumns.some((col) => col.fixed === "left")
        },
        isRightFixed() {
            return this.cloneColumns.some((col) => col.fixed === "right")
        },
        isFixSummary() {
            return this.fixSummary && this.showSummary && parseFloat(this.height) > 0 && this.getResultLen
        },
        isInnerSummary() {
            return this.showSummary && !parseFloat(this.height) > 0 && this.getResultLen
        },
        isColumnRows() {
            return this.columnRows.length > 1
        },
        summaryData() {
            if (!this.showSummary) return {}
            let sums = {}
            if (typeof this.summaryMethod === "function") {
                sums = this.summaryMethod({columns: this.cloneColumns, data: this.resultData})
            } else {
                this.cloneColumns.forEach((column, index) => {
                    const key = column.key
                    if (index === 0) {
                        sums[key] = {
                            key: column.key,
                            value: this.getSummaryText,
                        }
                        return
                    }
                    const values = this.resultData.map((item) => Number(item[column.key]))
                    const precisions = []
                    let notNumber = true
                    values.forEach((value) => {
                        if (!isNaN(value)) {
                            notNumber = false
                            let decimal = ("" + value).split(".")[1]
                            precisions.push(decimal ? decimal.length : 0)
                        }
                    })
                    const precision = Math.max.apply(null, precisions)
                    if (!notNumber) {
                        const currentValue = values.reduce((prev, curr) => {
                            const value = Number(curr)
                            if (!isNaN(value)) {
                                return parseFloat((prev + curr).toFixed(Math.min(precision, 20)))
                            } else {
                                return prev
                            }
                        }, 0)
                        sums[key] = {
                            key: column.key,
                            value: currentValue,
                        }
                    } else {
                        sums[key] = {
                            key: column.key,
                            value: "",
                        }
                    }
                })
            }
            return sums
        },
        getNoDataText() {
            if (this.noDataText === void 0) return this.langs("table.noDataText", "暂时没有相关数据")
            return this.noDataText
        },
        getSummaryText() {
            if (this.sumText === void 0) return this.langs("table.sumText", "合计")
            return this.sumText
        },
    },
    methods: {
        _handleSize(dom, diffVal = 0) {
            const domStyle = getStyles(dom) || {}
            const width = parseFloat(domStyle.width)
            const height = parseFloat(domStyle.height)
            const {clientHeight, offsetWidth} = dom
            return [
                isNaN(width) ? offsetWidth : width,
                isNaN(height) ? clientHeight : clientHeight - height > 4 ? clientHeight + diffVal : height,
            ]
        },

        setSplitWidth(column, width, boundaryPosition) {
            if (boundaryPosition) {
                this.dragableLine = boundaryPosition[0]
                return
            }
            this.dragableLine = null
            this.$set(column, "width", width)
            this.initSizes()
            this.$emit("on-split-moving", width, column.width, column)
        },
        setSrollSize() {
            const val = getScrollBarSize()
            this.scrollBarWidth = [
                this.bodySize[2] - this.bodySize[0] > 1 ? val : 0,
                this.bodySize[3] - this.bodySize[1] > 1 ? val : 0,
            ]
        },
        // 初始化数据
        makeData(data) {
            return (data || this.data).map(function(row, index) {
                row = {...row}
                row._index = index
                return row
            })
        },
        copyColumns() {
            this.__columns__ = deepCopy(this.columns)
        },
        makeColumns() {
            this.copyColumns()
            const allColumns = convertColumnOrder(getAllColumns(this.__columns__), this.layoutFixed)
            allColumns.forEach(function(column, index) {
                if (column.key === void 0) column.key = index
                column._index = index
                column._hasExpand = typeof column.renderExpand === "function"
            })
            return allColumns
        },
        makeColumnRows() {
            return convertToRows(this.__columns__, this.layoutFixed)
        },
        makeActionData(data) {
            const actionData = {}
            ;(data || this.data || []).forEach(function(row, index) {
                const newRow = {}
                newRow._isHover = !!row._hover
                newRow._isHighlight = !!row._highlight
                newRow._isExpanded = !!row._expanded
                newRow._index = index
                newRow._isShowChildren = !!row._isShowChildren
                newRow._childDeep = row._childDeep || 0
                actionData[index] = newRow
            })
            return actionData
        },
        // common
        init() {
            this.columnStatus.check = {}
            this.translateSize = 0
            if (this._performanceScroll) {
                this._performanceScroll.reset()
                this.initPerformanceScroll({
                    performance: this.initPerformance,
                    length: this.baseLength,
                    total: this.resultData.length,
                })
            }
        },
        // 性能优化
        initPerformanceScroll(opts = {}) {
            if (!this._performanceScroll &&  this.initPerformance !== "middle" && this.initPerformance !== "high") return
            this.$nextTick(() => {
                if (this.$refs.body) {
                    if (this._performanceScroll) {
                        this._performanceScroll.update(this.$refs.body, opts)
                        return
                    }
                    this._performanceScroll = new PerformanceScroll(
                        this.$refs.body,
                        {
                            performance: this.initPerformance,
                            beforeScroll: () => this.isPerformance || this.sizeIndex < this.resultData.length,
                            length: this.baseLength,
                            total: this.resultData.length,
                            cellElement: "table>tbody>tr",
                            ...opts,
                        },
                        ({index, translate, length}, type) => {
                            if (type === "over") return
                            const total = this.resultData.length
                            this.sizeIndex = index + length > total ? total - length + 1 : index
                            this.sizeLength = length
                            this.translateSize = translate
                            this.$nextTick(() => {
                                if (
                                    type === "down" ||
                                    ((type === "top" || type === "up") && this.initPerformance === "high")
                                ) {
                                    this.updateSync(this.$refs.body)
                                    return
                                }
                                if (type === "up") {
                                    this.$nextTick(() => {
                                        this._scrollTopSync && this._scrollTopSync.sync(this.$refs.body)
                                    })
                                }
                            })
                        }
                    )
                }
            })
        },
        updateSync(target) {
            this.rebuildData = this.getSizeData
            this.initSizes()
            this.$nextTick(() => {
                this._scrollTopSync && this._scrollTopSync.sync(target)
            })
        },

        setScrollSync() {
            this.$nextTick(() => {
                AnimationFrame.requestFrame(() => {
                    const {rightScroll, leftScroll, body, headScroll, summaryScroll} = this.$refs
                    const scrollTopEle = [],
                        scrollLeftEle = []
                    if (rightScroll) scrollTopEle.push(rightScroll)
                    if (leftScroll) scrollTopEle.push(leftScroll)
                    if (headScroll) scrollLeftEle.push(headScroll)
                    if (summaryScroll) scrollLeftEle.push(summaryScroll)
                    // console.log(summaryScroll)
                    if (body) {
                        scrollTopEle.push(body)
                        scrollLeftEle.push(body)
                    }
                    if ((this.isRightFixed || this.isLeftFixed) && scrollTopEle.length > 1) {
                        if (this._scrollTopSync) {
                            this._scrollTopSync.update(scrollTopEle)
                        } else {
                            this._scrollTopSync = new ScrollSync(scrollTopEle, {
                                isScrollTop: true,
                                throttle: null,
                            })
                        }
                    }
                    if ((this.isFixHead || this.fixSummary) && scrollLeftEle.length > 1) {
                        if (this._scrollLeftSync) {
                            this._scrollLeftSync.update(scrollLeftEle)
                        } else {
                            this._scrollLeftSync = new ScrollSync(scrollLeftEle, {throttle: null})
                        }
                    }
                })
            })
        },
        clickCurrentRow(_index, isdb) {
            if (!this.highlightRow) return
            const actionData = this.actionData[_index]
            actionData._isHighlight = !actionData._isHighlight
            this.$emit(isdb ? "on-row-dbclick" : "on-row-click", {...this.cloneData[_index]}, _index)
        },
        handleMouseIn(_index) {
            if (!this.hover) {
                this.hoverRowIndex = -1
                return
            }
            this.hoverRowIndex = _index
            if (`${_index}`.indexOf("@expanded") > -1) {
                this.$emit("on-row-hover", null, _index, true)
            } else {
                this.$emit("on-row-hover", {...this.cloneData[_index]}, _index, true)
            }
        },
        handleMouseOut(_index) {
            if (!this.hover) {
                this.hoverRowIndex = -1
                return
            }
            this.hoverRowIndex = _index
            if (`${_index}`.indexOf("@expanded") > -1) {
                this.$emit("on-row-hover", null, _index, false)
            } else {
                this.$emit("on-row-hover", {...this.cloneData[_index]}, _index, true)
            }
        },

        // 用于一些额外的功能函数
        // columnStatus
        handleColumnStatus(type, a, b, c, d) {
            console.log(type, a, b, c, d)
            if (type === "sort") {
                this.sortChange(a, b)
                return
            }
            if (type === "check") {
                if (c === "selectAll") {
                    this.handleCheckAll(a, b)
                } else {
                    this.handleCheckChange(a, b, d)
                }
                return
            }
            if (type === "filter") {
                this.filterChange(a, b)
                return
            }
        },
        handleCheckAll(column, status) {
            const check = this.columnStatus.check,
                {key, formName} = column
            if (status) {
                const indexs = []
                const checkVals = this.resultData.map(function(row) {
                    indexs.push(row._index)
                    return formName ? row[formName] : row._index
                })
                this.$set(check, key, indexs)
                this.$emit("on-select-change", JSON.parse(JSON.stringify(this.resultData)), checkVals, {
                    key,
                    status: true,
                    type: "selectAll",
                })
            } else {
                this.$set(check, key, [])
                this.$emit("on-select-change", [], [], {
                    key,
                    status: false,
                    type: "selectAll",
                })
            }
        },
        handleCheckChange(column, status, index) {
            let check = this.columnStatus.check,
                {key, formName, isRadio} = column,
                indexs = check[key] || [],
                curdata = this.rebuildData[index],
                _index = curdata._index,
                curval = formName ? curdata[formName] : _index
            if (isRadio) {
                this.$set(check, key, status ? [_index] : [])
                this.$emit("on-radio-change", curdata, status ? curval : "", {
                    key,
                    status,
                    value: curval,
                    type: "radio",
                    index,
                })
                return
            }
            if (status) {
                indexs.push(_index)
            } else {
                indexs = indexs.filter(function(item) {
                    return item != _index
                })
            }
            const rows = [],
                checkVals = []
            indexs.forEach((item) => {
                const data = this.cloneData[item]
                rows.push(data)
                checkVals.push(formName ? data[formName] : _index)
            })
            this.$set(check, key, indexs)
            this.$emit("on-select-change", JSON.parse(JSON.stringify(rows)), checkVals, {
                key,
                status,
                value: curval,
                type: "select",
                index,
            })
        },
        sortChange(sort, column) {
            const sortStatus = this.columnStatus.sort,
                {key, multi, sync} = column,
                multiSort = multi === true || (multi || {}).sort
            if (multiSort) {
                this.$set(sortStatus, key, sort)
            } else {
                this.columnStatus.sort = {}
                this.$set(this.columnStatus.sort, key, sort)
            }
            if (sync === true || (sync || {}).sort) {
                this.handleSort()
                return
            }
            this.$emit("on-sort-change", sort, key, {column, multiSort})
        },
        handleSort() {
            let resultData = this.resultData
            Object.entries(this.columnStatus.sort).forEach(function([key, value]) {
                if (value === "desc") {
                    resultData = resultData.sort(function(pre, next) {
                        return pre[key] > next[key] ? -1 : 1
                    })
                } else if (value === "asc") {
                    resultData = resultData.sort(function(pre, next) {
                        return pre[key] > next[key] ? 1 : -1
                    })
                }
            })
            this.resetbuildData(resultData)
        },
        filterChange(val, column) {
            const filterStatus = this.columnStatus.filter,
                {key, multi, sync} = column,
                multiFilter = multi === true || (multi || {}).filter
            if (multiFilter) {
                this.$set(filterStatus, key, val)
            } else {
                this.columnStatus.filter = {}
                this.$set(this.columnStatus.filter, key, val)
            }
            if (sync === true || (sync || {}).filter) {
                this.handleFilter()
                return
            }
            this.$emit("on-filter-change", val, key, {column, multiFilter})
        },
        handleFilter() {
            let resultData = this.cloneData,
                filterStatus = this.columnStatus.filter
            this.cloneColumns.forEach(function(column) {
                const filterMethod = column.filterMethod
                if (typeof filterMethod === "function") {
                    const value = filterStatus[column.key]
                    resultData = resultData.filter(function(item) {
                        return filterMethod(value, item)
                    })
                }
            })
            this.resetbuildData(resultData)
        },
        resetbuildData(resultData) {
            this.init()
            this.resultData = resultData
            this.rebuildData = this.getSizeData
            this.initSizes()
        },
        toggleExpand(_index) {
            const data = this.actionData[_index],
                status = !data._isExpanded
            if (!this.multiExpand) {
                for (let i in this.actionData) {
                    this.actionData[i]._isExpanded = false
                }
            }
            this.actionData[_index]._isExpanded = status
            this.$emit("on-expand", {...this.cloneData[_index]}, status)
            this.initSizes()
        },
        async toggleTree(index) {
            const row = this.cloneData[index]
            if (this.actionData[index]._isShowChildren) {
                let i = 0,
                    status = true
                this.cloneData.slice(index + 1).forEach((item) => {
                    if (!status) return
                    if (item._isChild) {
                        i++
                    } else {
                        status = false
                    }
                })
                row._isShowChildren = false
                this.cloneData.splice(index + 1, i)
            } else {
                console.log(row, "-------------")
                if (typeof this.asyncData === "function" && row.children && !row.children.length) {
                    this.$set(row, "_loading", true)
                    const result = await this.asyncData(row, index).catch(console.log)
                    if (Array.isArray(result)) {
                        this.$set(row, "children", result)
                    }
                    this.$set(row, "_loading", false)
                }
                row._isShowChildren = true
                this.cloneData.splice(
                    index + 1,
                    0,
                    ...row.children.map((child) => {
                        return {
                            ...child,
                            _childDeep: this.actionData[index]._childDeep + 1,
                            _isChild: true,
                        }
                    })
                )
            }
            this.actionData = this.makeActionData(this.cloneData)
            this.cloneData = this.resultData = this.makeData(this.cloneData)
            this.rebuildData = this.getSizeData
            this.initSizes()
        },
    },
    watch: {
        columns: {
            handler() {
                this.cloneColumns = this.makeColumns()
                this.columnRows = this.makeColumnRows()
                this.initSizes()
                this.setScrollSync()
            },
            deep: true,
        },
        data: {
            handler() {
                this.init()
                this.actionData = this.makeActionData()
                this.cloneData = this.resultData = this.makeData()
                this.rebuildData = this.getSizeData
                this.initSizes()
            },
            deep: true,
        },
        height() {
            this.initSizes()
        },
        ellipsis() {
            this.initSizes()
        },
        showHeader() {
            this.initSizes()
        },
        fixHeader() {
            this.initSizes()
        },
        fixSummary() {
            this.initSizes()
        },
        size() {
            this.initSizes()
        },
        initPerformance() {
            this.initPerformanceScroll({
                performance: this.initPerformance,
                length: this.baseLength,
                total: this.resultData.length,
            })
        },
    },
    beforeDestroy() {
        EventListener.off(window, "resize", this.initSizes)
        this.initSizes && this.initSizes.cancel && this.initSizes.cancel()
        this._scrollTopSync && this._scrollTopSync.destroy()
        this._scrollLeftSync && this._scrollLeftSync.destroy()
        this._performanceScroll && this._performanceScroll.destroy()
        this._performanceScroll = this.initSizes = this._scrollTopSync = this._scrollLeftSync = null
    },
}
