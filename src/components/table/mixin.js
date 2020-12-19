
import { getAllColumns, convertToRows, convertColumnOrder } from './utils/columns';
import { unit, deepCopy } from '../../utils/tool';
import { getScrollBarSize, EventListener, ScrollSync, AnimationFrame, getStyles } from "../../utils/dom";
import Thead from "./thead";
import Summary from "./summary";
import Tbody from "./tbody";
import Tooltip from "../tooltip/index";
import langMinix from '../../mixins/lang';
import Colgroups from "./colgroups";
export default {
    mixins: [langMinix],
    components: {
        Thead,
        Tbody,
        Tooltip,
        Summary,
        Colgroups
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        columns: {
            type: Array,
            default() {
                return [];
            },
        },
        width: Number,
        height: Number,
        stripe: {
            type: Boolean,
            default: false,
        },
        border: {
            type: String,
            // default: 'vertical',
        },
        size: {
            type: String,
            // default: 'vertical',
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        highlightRow: {
            type: Boolean,
            default: false,
        },
        hover: {
            type: Boolean,
            default: false,
        },
        ellipsis: {
            type: Boolean,
            default: false,
        },
        fixHeader: {
            type: Boolean,
            default: false,
        },
        noDataText: {
            type: String,
            // default: '暂时没有相关数据',
            default: undefined,
        },
        performance: {
            type: String,
            default: 'normal',//normal,auto,middle,high
        },
        multiExpand: Boolean,
        baseLength: {
            type: Number,
            default: 12
        },
        showSummary: Boolean,
        isLayoutAuto: Boolean,
        fixSummary: Boolean,
        loadData: Function,
        sumText: {
            type: String,
            // default: "合计"
            default: undefined
        }
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
            sizeLength: 0,
            scrollBarWidth: [0, 0],//[x,y]
            translate: 0,
            bodySize: [],
            translateList: [],
            layoutFixed: false,
            summarySize: [0, 0],
            tooltip: {
                show: false
            },
        };
    },
    created() {
        this.cloneColumns = this.makeColumns();
        this.columnRows = this.makeColumnRows();
        this.actionData = this.makeActionData();
        this.cloneData = this.resultData = this.makeData();
        this.init();
        this.rebuildData = this.getSizeData;
    },
    mounted() {
        // this.ready = true;
        this.initSizes();
        this.setScrollSync();
        EventListener.on(window, 'resize', this.initSizes)
    },
    activated() {
        this.initSizes();
        EventListener.on(window, 'resize', this.initSizes)
    },
    deactivated() {
        EventListener.off(window, 'resize', this.initSizes)
    },
    computed: {
        isLayoutFixed() {
            return (this.isFixHead && this.showHeader) || this.isFixed;
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-${this.size}`]: !!this.size,
                    [`${_tobogPrefix_}-ready`]: this.ready,
                    [`${_tobogPrefix_}-stripe`]: this.stripe,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-${this.border}`]: !!this.border,
                    [`${_tobogPrefix_}-ellipsis`]: this.ellipsis,
                    [`${_tobogPrefix_}-layout-auto`]: this.isLayoutAuto && !this.isLayoutFixed,
                    [`${_tobogPrefix_}-fix-summary`]: this.isFixSummary,
                    [`${_tobogPrefix_}-fix-header`]: this.isFixHead && this.showHeader,
                }
            ];
        },
        getSizeData() {
            if (this.initPerformance === 'middle') return this.resultData.slice(0, this.getContentLen);
            if (this.initPerformance === 'high') return this.resultData.slice(this.sizeLength, this.getContentLen);
            return this.resultData;
        },
        getResultLen() {
            return this.getSizeData.length
        },
        isFixHead() {
            return this.fixHeader && parseFloat(this.height) > 0
        },
        wrapStyles() {
            const height = unit(this.height, 'px');
            if (height) return { height };
        },
        getDataLen() {
            return this.resultData.length
        },
        getContentLen() {
            return this.sizeLength + this._baseLength
        },
        isPerformance() {
            return (this.initPerformance === 'middle' || this.initPerformance === 'high') && (this.getContentLen - this.sizeLength) < this.getDataLen
        },
        getTotalTranslate() {
            return this.translateList.reduce(function (acc, cur) {
                return acc + cur
            }, 0)
        },
        initPerformance() {
            const performance = this.performance;
            if (performance === 'auto') {
                const length = this.getDataLen;
                if (length < 200) return 'normal';
                if (length < 500) return 'middle';
                return 'high';
            }
            return performance;
        },
        normalColumns() {
            return this.isColumnRows ? this.columnRows : [this.cloneColumns];
        },
        isFixed() {
            return this.isLeftFixed || this.isRightFixed
        },
        isLeftFixed() {
            return this.cloneColumns.some(col => col.fixed === "left");
        },
        isRightFixed() {
            return this.cloneColumns.some(col => col.fixed === "right");
        },
        isFixSummary() {
            return this.fixSummary && this.showSummary && parseFloat(this.height) > 0 && this.getResultLen
        },
        isInnerSummary() {
            return this.showSummary && (!parseFloat(this.height) > 0) && this.getResultLen
        },
        isColumnRows() {
            return this.columnRows.length > 1;
        },
        summaryData() {
            if (!this.showSummary) return {};
            let sums = {};
            if (this.summaryMethod) {
                sums = this.summaryMethod({ columns: this.cloneColumns, data: this.rebuildData });
            } else {
                this.cloneColumns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key: column.key,
                            value: this.getSummaryText
                        };
                        return;
                    }
                    const values = this.rebuildData.map(item => Number(item[column.key]));
                    const precisions = [];
                    let notNumber = true;
                    values.forEach(value => {
                        if (!isNaN(value)) {
                            notNumber = false;
                            let decimal = ('' + value).split('.')[1];
                            precisions.push(decimal ? decimal.length : 0);
                        }
                    });
                    const precision = Math.max.apply(null, precisions);
                    if (!notNumber) {
                        const currentValue = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[key] = {
                            key: column.key,
                            value: currentValue
                        };
                    } else {
                        sums[key] = {
                            key: column.key,
                            value: ''
                        };
                    }
                });
            }
            return sums;
        },
        getNoDataText() {
            if (this.noDataText === undefined) return this.langs('table.noDataText', '暂时没有相关数据');
            return this.noDataText
        },
        getSummaryText() {
            if (this.sumText === undefined) return this.langs('table.sumText', '合计');
            return this.sumText
        },
    },
    methods: {
        _handleSize(dom, diffVal = 0) {
            const domStyle = getStyles(dom) || {};
            const width = parseFloat(domStyle.width);
            const height = parseFloat(domStyle.height);
            const { clientHeight, offsetWidth } = dom;
            return [
                isNaN(width) ? offsetWidth : width,
                isNaN(height)
                    ? clientHeight
                    : clientHeight - height > 4
                        ? clientHeight + diffVal
                        : height
            ];
        },
        setSplitWidth(column, width) {
            this.$set(column, 'width', width);
            this.initSizes();
            this.$emit('on-split-moving', width, column.width, column);
        },
        setSrollSize() {
            const val = getScrollBarSize();
            // console.log(this.bodySize)
            this.scrollBarWidth = [
                this.bodySize[2] - this.bodySize[0] > 1 ? val : 0,
                this.bodySize[3] - this.bodySize[1] > 1 ? val : 0,
            ];
        },
        // 初始化数据
        makeData(data) {
            return (data || this.data).map(function (row, index) {
                row = { ...row };
                row._index = index;
                return row;
            });
        },
        copyColumns() {
            this.__columns__ = deepCopy(this.columns)
        },
        makeColumns() {
            this.copyColumns();
            const allColumns = convertColumnOrder(getAllColumns(this.__columns__), this.layoutFixed);
            allColumns.forEach(function (column, index) {
                if (column.key === undefined) column.key = index;
                column._index = index;
                column._hasExpand = typeof column.renderExpand === 'function';
            });
            return allColumns;
        },
        makeColumnRows() {
            return convertToRows(this.__columns__, this.layoutFixed);
        },
        makeActionData(data) {
            const actionData = {};
            (data || this.data || []).forEach(function (row, index) {
                const newRow = {};
                newRow._isHover = !!row._hover;
                newRow._isHighlight = !!row._highlight;
                newRow._isExpanded = !!row._expanded;
                newRow._index = index;
                newRow._isShowChildren = !!row._isShowChildren;
                newRow._childDeep = row._childDeep || 0;
                actionData[index] = newRow;
            });
            return actionData;
        },
        // common
        init() {
            const size = parseInt(this.baseLength);
            this._baseLength = (isNaN(size) ? 16 : size) + 10;
            this._performance = false;
            this._preScrollTop = 0;
            this.translateList = [];
            this.columnStatus.check = {};
        },
        handlePerformance(event) {//scroll current target
            const target = event.currentTarget;
            if (!this.isPerformance) return;
            const { scrollTop, clientHeight, scrollHeight } = target;
            const direction = (scrollTop - this._preScrollTop) > 0,
                translate = this.getTotalTranslate,
                edageHeight = 100;
            this._preScrollTop = scrollTop;
            if (scrollTop < edageHeight) {
                if (this._performance) return;
                this._performance = true;
                this.sizeLength = this._preScrollTop = 0;
                this.translateList = [];
                this.updateSync(target);
                return;
            }

            if (!direction && scrollTop && translate && (scrollTop < translate + edageHeight)) {
                this.handleScrollUp(scrollTop);
                this.updateSync(target);
            } else if (direction && (clientHeight + scrollTop + 60 > scrollHeight)) {
                if (this._performance) return;
                this._performance = true;
                this.handleScrollDown();
                // this.updateSync(target);
                this._scrollTopSync && this._scrollTopSync.sync(target)
            } else {
                this._performance = false
            }
        },
        updateSync(target) {
            this.rebuildData = this.getSizeData;
            this.initSizes();
            this.$nextTick(() => {
                this._scrollTopSync && this._scrollTopSync.sync(target)
            })
        },
        handleScrollDown() {
            this.sizeLength += 5;
            if (this.initPerformance === 'middle') {
                if (this.getContentLen > this.getDataLen) this.sizeLength = this.getDataLen;
                return
            }
            let height = 0;
            const body = this.$refs.body;
            const trList = body.querySelector("table>tbody").children;
            for (let index = 0; index < 5; index++) {
                height += trList[index].clientHeight || 0;
            }
            this.translateList.push(height);
        },
        handleScrollUp(scrollTop = 0) {
            if (this.initPerformance === 'middle') return;
            let height = 0, i = 0;
            for (let index = 0, len = this.translateList.length; index < len; index++) {
                height += this.translateList[index] || 0;
                //0<= s-total-100<tnext
                const val = scrollTop - height - 100, next = this.translateList[index + 1];
                if (val >= 0 && ((next && val < next) || !next)) {
                    i = index;
                    break;
                }
                i = index;
            }
            this.sizeLength = i * 5;
            this.translateList = this.translateList.slice(0, i);
        },
        setScrollSync() {
            this.$nextTick(() => {
                AnimationFrame.requestFrame(() => {
                    const {
                        rightScroll,
                        leftScroll,
                        body,
                        headScroll,
                        summaryScroll
                    } = this.$refs;
                    const scrollTopEle = [],
                        scrollLeftEle = [];
                    if (rightScroll) scrollTopEle.push(rightScroll);
                    if (leftScroll) scrollTopEle.push(leftScroll);
                    if (headScroll) scrollLeftEle.push(headScroll);
                    if (summaryScroll) scrollLeftEle.push(summaryScroll);
                    // console.log(summaryScroll)
                    if (body) {
                        scrollTopEle.push(body);
                        scrollLeftEle.push(body);
                    }
                    if ((this.isRightFixed || this.isLeftFixed) && scrollTopEle.length > 1) {
                        if (this._scrollTopSync) {
                            this._scrollTopSync.update(scrollTopEle);
                        } else {
                            this._scrollTopSync = new ScrollSync(scrollTopEle, {
                                isScrollTop: true,
                                throttle: null
                            });
                        }
                    }
                    if ((this.isFixHead || this.fixSummary) && scrollLeftEle.length > 1) {
                        if (this._scrollLeftSync) {
                            this._scrollLeftSync.update(scrollLeftEle);
                        } else {
                            this._scrollLeftSync = new ScrollSync(scrollLeftEle, { throttle: null });
                        }
                    }
                })
            });
        },
        clickCurrentRow(_index, isdb) {
            if (!this.highlightRow) return;
            const actionData = this.actionData[_index];
            actionData._isHighlight = !actionData._isHighlight;
            this.$emit(isdb ? 'on-row-dbclick' : 'on-row-click', { ...this.cloneData[_index] }, _index);
        },
        handleMouseIn(_index) {
            if (!this.hover) return;
            const actionData = this.actionData[_index];
            if (!actionData._isHover) actionData._isHover = true;
            this.$emit(
                "on-row-hover",
                { ...this.cloneData[_index] },
                _index,
                true
            );
        },
        handleMouseOut(_index) {
            if (!this.hover) return;
            this.actionData[_index]._isHover = false;
            this.$emit(
                "on-row-hover",
                { ...this.cloneData[_index] },
                _index,
                false
            );
        },

        // 用于一些额外的功能函数
        // columnStatus
        handleColumnStatus(type, a, b, c, d) {
            console.log(type, a, b, c, d)
            if (type === "sort") {
                this.sortChange(a, b);
                return;
            }
            if (type === "check") {
                if (c === "selectAll") {
                    this.handleCheckAll(a, b);
                } else {
                    this.handleCheckChange(a, b, d);
                }
                return;
            }
            if (type === "filter") {
                this.filterChange(a, b);
                return;
            }
        },
        handleCheckAll(column, status) {
            const check = this.columnStatus.check,
                { key, formName } = column;
            if (status) {
                const indexs = [];
                const checkVals = this.resultData.map(function (row) {
                    indexs.push(row._index);
                    return formName ? row[formName] : row._index;
                });
                this.$set(check, key, indexs);
                this.$emit(
                    "on-select-change",
                    JSON.parse(JSON.stringify(this.resultData)),
                    checkVals,
                    { key, status: true, type: "selectAll" }
                );
            } else {
                this.$set(check, key, []);
                this.$emit("on-select-change", [], [], {
                    key,
                    status: false,
                    type: "selectAll"
                });
            }
        },
        handleCheckChange(column, status, index) {
            let check = this.columnStatus.check,
                { key, formName, isRadio } = column,
                indexs = check[key] || [],
                curdata = this.rebuildData[index],
                _index = curdata._index,
                curval = formName ? curdata[formName] : _index;
            if (isRadio) {
                this.$set(check, key, status ? [_index] : []);
                this.$emit(
                    "on-radio-change",
                    curdata,
                    status ? curval : "",
                    {
                        key,
                        status,
                        value: curval,
                        type: "radio",
                        index,
                    }
                );
                return;
            }
            if (status) {
                indexs.push(_index);
            } else {
                indexs = indexs.filter(function (item) {
                    return item != _index;
                });
            }
            const rows = [],
                checkVals = [];
            indexs.forEach(item => {
                const data = this.cloneData[item];
                rows.push(data);
                checkVals.push(formName ? data[formName] : _index);
            });
            this.$set(check, key, indexs);
            this.$emit(
                "on-select-change",
                JSON.parse(JSON.stringify(rows)),
                checkVals,
                {
                    key,
                    status,
                    value: curval,
                    type: "select",
                    index,
                }
            );
        },
        sortChange(sort, column) {
            const sortStatus = this.columnStatus.sort,
                { key, multi, sync } = column,
                multiSort = multi === true || (multi || {}).sort;
            if (multiSort) {
                this.$set(sortStatus, key, sort);
            } else {
                this.columnStatus.sort = {};
                this.$set(this.columnStatus.sort, key, sort);
            }
            if (sync === true || (sync || {}).sort) {
                this.handleSort();
                return;
            }
            this.$emit("on-sort-change", sort, key, { column, multiSort });
        },
        handleSort() {
            let resultData = this.resultData;
            Object.entries(this.columnStatus.sort).forEach(function ([key, value]) {
                if (value === "desc") {
                    resultData = resultData.sort(function (pre, next) {
                        return pre[key] > next[key] ? -1 : 1;
                    });
                } else if (value === "asc") {
                    resultData = resultData.sort(function (pre, next) {
                        return pre[key] > next[key] ? 1 : -1;
                    });
                }
            });
            this.resetbuildData(resultData);
        },
        filterChange(val, column) {
            const filterStatus = this.columnStatus.filter,
                { key, multi, sync } = column,
                multiFilter = multi === true || (multi || {}).filter;
            if (multiFilter) {
                this.$set(filterStatus, key, val);
            } else {
                this.columnStatus.filter = {};
                this.$set(this.columnStatus.filter, key, val);
            }
            if (sync === true || (sync || {}).filter) {
                this.handleFilter();
                return;
            }
            this.$emit("on-filter-change", val, key, { column, multiFilter });
        },
        handleFilter() {
            let resultData = this.cloneData,
                filterStatus = this.columnStatus.filter;
            this.cloneColumns.forEach(function (column) {
                const filterMethod = column.filterMethod;
                if (typeof filterMethod === "function") {
                    const value = filterStatus[column.key];
                    resultData = resultData.filter(function (item) {
                        return filterMethod(value, item);
                    });
                }
            });
            this.resetbuildData(resultData);
        },
        resetbuildData(resultData) {
            this.init();
            this.resultData = resultData;
            this.rebuildData = this.getSizeData;
            this.initSizes();
        },
        toggleExpand(_index) {
            const data = this.actionData[_index],
                status = !data._isExpanded;
            if (!this.multiExpand) {
                for (let i in this.actionData) {
                    this.actionData[i]._isExpanded = false;
                }
            }
            this.actionData[_index]._isExpanded = status;
            this.$emit('on-expand', { ...this.cloneData[_index] }, status);
            this.initSizes();
        },
        async toggleTree(index) {
            let row = this.cloneData[index];
            if (this.actionData[index]._isShowChildren) {
                let i = 0, status = true;
                this.cloneData.slice(index + 1).forEach((item) => {
                    if (!status) return;
                    if (item._isChild) {
                        i++
                    } else {
                        status = false;
                    }
                })
                row._isShowChildren = false;
                this.cloneData.splice(index + 1, i);
            } else {
                console.log(this.loadData, row);
                if (typeof this.loadData === 'function') {
                    let result = await this.loadData(row);
                    if (Array.isArray(result)) {
                        this.$set(row, 'children', result);
                    }
                }
                row._isShowChildren = true;
                this.cloneData.splice(index + 1, 0, ...row.children.map(child => {
                    return {
                        ...child,
                        _childDeep: this.actionData[index]._childDeep + 1,
                        _isChild: true,
                    }
                }));
            }
            this.actionData = this.makeActionData(this.cloneData);
            this.cloneData = this.resultData = this.makeData(this.cloneData);
            this.rebuildData = this.getSizeData;
            this.initSizes();
        }
    },
    watch: {
        columns: {
            handler() {
                this.cloneColumns = this.makeColumns();
                this.columnRows = this.makeColumnRows();
                this.initSizes();
                this.setScrollSync();
            },
            deep: true
        },
        data: {
            handler() {
                this.init();
                this.actionData = this.makeActionData();
                this.cloneData = this.resultData = this.makeData();
                this.rebuildData = this.getSizeData;
                this.initSizes();
            },
            deep: true
        },
        height() {
            this.initSizes();
        },
        ellipsis() {
            this.initSizes();
        },
        showHeader() {
            this.initSizes();
        },
        fixHeader() {
            this.initSizes();
        },
        fixSummary() {
            this.initSizes();
        },
        size() {
            this.initSizes();
        }
    },
    beforeDestroy() {
        EventListener.off(window, 'resize', this.initSizes);
        this._scrollTopSync && this._scrollTopSync.destroy();
        this._scrollLeftSync && this._scrollLeftSync.destroy();
    },
};
