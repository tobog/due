
import { getAllColumns, convertToRows, convertColumnOrder } from './utils/columns';
import { deepCopy } from '../../utils/tool';
export default {
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
            type: Boolean,
            default: false,
        },
        showThead: {
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
        loading: {
            type: Boolean,
            default: false,
        },
        ellipsis: {
            type: Boolean,
            default: false,
        },
        size: {
            type: [String, Number],
            // default: 'default',
        },
        noDataText: {
            type: String,
            default: undefined,
            // default: '暂时没有相关数据',
        },
        column: Object,
        performance: {
            type: String,
            default: 'normal',//normal,auto,middle,high
        },
        multiExpand: Boolean,
        // delay: {
        //     type: Boolean,
        //     default: false,
        // },
        length: {
            type: Number,
            default: 12
        }
        // multiSort: Boolean,
        // multiFilter: Boolean,
    },
    data() {
        return {
            actionData: this.makeActionData(),
            rebuildData: [],
            resultData: [],
            cloneColumns: this.makeColumns(),
            columnRows: this.makeColumnRows(),
            cloneData: [],
            columnStatus: {
                sort: {},
                filter: {},
                check: {},
            },
            sizelength: 0,
            translateList: [],
        };
    },
    created() {
        this.cloneData = this.resultData = this.makeData();
        this.init();
        this.rebuildData = this.getSizeData;
    },
    computed: {

        getSizeData() {
            console.log(this.sizelength, this.getContentLen)
            if (this.initPerformance === 'middle') return this.resultData.slice(0, this.getContentLen);
            if (this.initPerformance === 'high') return this.resultData.slice(this.sizelength, this.getContentLen);
            return this.resultData;
        },
        wrapStyles() {
            const style = {},
                height = this.height,
                width = this.width;
            if (height) style.height = `${height}px`;
            if (width) style.width = `${width}px`;
            return style;
        },
        getLength() {
            return this.resultData.length
        },
        getContentLen() {
            return this.sizelength + this._sizelength
        },
        getTotalTranslate() {
            return this.translateList.reduce(function (acc, cur, index, arr) {
                return acc + cur
            }, 0)
        },
        isPerformance() {
            return (this.initPerformance === 'middle' || this.initPerformance === 'high') && this.getContentLen < this.getLength
        },
        initPerformance() {
            const performance = this.performance;
            if (performance === 'auto') {
                const length = this.getLength;
                if (length < 200) return 'normal';
                if (length < 500) return 'middle';
                return 'high';
            }
            return performance;
        },
        getNoDataText() {
            if (this.noDataText === undefined) return this.langs('noDataText', '暂时没有相关数据');
            return this.noDataText
        },
    },
    methods: {
        langs(key, defaultVal, val = {}) {
            if (typeof this.$t !== 'function') return defaultVal;
            key = `${this.__$langPrefix__}.table.${key}`;
            key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
            const value = this.$t(key, val);
            return key === value ? defaultVal : value;
        },
        // common
        init() {
            const size = parseInt(this.length), { leftFixedTbody, rightFixedTbody, body } = this.$refs;
            this._sizelength = (isNaN(size) ? 16 : size) + 10;
            if (body) body.scrollTop = 0;
            if (this.isLeftFixed && leftFixedTbody) leftFixedTbody.scrollTop = 0;
            if (this.isRightFixed && rightFixedTbody) rightFixedTbody.scrollTop = 0;
            this._performance = false;
            this._preScrollTop = 0;
            this.translateList = [];
            this.columnStatus.check = {};
            // this.performanceStatus = this.initPerformance;
        },

        handleSplit(index, axis) {
            const column = this.cloneColumns[index], { relative, run } = axis;
            this.$el.style.userSelect = run ? "none" : "";
            column._width = (column._width || column.width || 0) + relative[0];
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
            this.$emit('on-expand', JSON.parse(JSON.stringify(this.cloneData[_index])), status);
        },
        handleBodyScroll(event) {
            const { scrollLeft, scrollTop } = event.target,
                { leftFixedTbody, rightFixedTbody, head } = this.$refs;
            if (this.showThead && head) head.scrollLeft = scrollLeft;
            if (this.isLeftFixed && leftFixedTbody)
                leftFixedTbody.scrollTop = scrollTop;
            if (this.isRightFixed && rightFixedTbody)
                rightFixedTbody.scrollTop = scrollTop;
            this.handlePerformance(event);
        },
        handleMousePerformance(event) {
            if (!this.isPerformance) return;
            const wheelDelta = event.wheelDelta,
                detail = event.detail,
                target = event.currentTarget,
                scrollHeight = target.scrollHeight,
                clientHeight = target.clientHeight;
            if (scrollHeight - clientHeight > 1) return;
            let deltaY = 0;
            if (wheelDelta) {
                deltaY = -wheelDelta;
            } else if (detail) {
                deltaY = detail * 40;
            }
            if (deltaY > 0) {
                this.sizelength += 5;
                this.rebuildData = this.getSizeData;
            }
        },
        handlePerformance(event) {
            if (!this.isPerformance) return;
            const target = event.target,
                { scrollTop, clientHeight, scrollHeight } = target;
            const direction = (scrollTop - this._preScrollTop) > 0,
                translate = this.getTotalTranslate;
            this._preScrollTop = scrollTop;
            if (scrollTop < 100) {
                if (this._performance) return;
                this._performance = true;
                this.sizelength = this._preScrollTop = 0;
                this.translateList = [];
                this.rebuildData = this.getSizeData;
                console.log(scrollTop, 'scrollTop')
                return;
            }
            if (!direction && scrollTop && translate && (scrollTop < translate + 100)) {
                this.handleScrollUp(scrollTop);
                this.rebuildData = this.getSizeData;
            } else if (direction && (clientHeight + scrollTop + 100 > scrollHeight)) {
                if (this._performance) return;
                this._performance = true;
                this.handleScrollDown();
                this.rebuildData = this.getSizeData;
            } else {
                this._performance = false
            }
        },
        handleScrollDown() {
            this.sizelength += 5;
            if (this.initPerformance === 'middle') {
                if (this.getContentLen > this.getLength) this.sizelength = this.getLength;
                return
            }
            let height = 0;
            const table = this.$refs.tbody;
            const trList = table.querySelector("tbody").children;
            for (let index = 0; index < 5; index++) {
                height += trList[index].clientHeight || 0;
            }
            this.translateList.push(height);
        },
        handleScrollUp(scrollTop = 0) {
            console.log(this.initPerformance, 'middle')
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
            this.sizelength = i * 5;
            this.translateList = this.translateList.slice(0, i);

        },
        clickCurrentRow(_index, isdb) {
            if (!this.highlightRow) return;
            const actionData = this.actionData[_index], row = JSON.parse(JSON.stringify(this.cloneData[_index]));
            actionData._isHighlight = !actionData._isHighlight;
            this.$emit(isdb ? 'on-row-dbclick' : 'on-row-click', row, _index);
        },
        // 初始化数据

        makeData() {
            const data = deepCopy(this.data) || [];
            data.forEach(function (row, index) {
                row._index = index;
            });
            return data;
        },
        makeColumns() {
            const allColumns = convertColumnOrder(getAllColumns(this.columns));
            const columns = [], colSpanMap = [];
            allColumns.forEach(function (column, index) {
                const colsSpan = column.colsSpan;
                column._index = index;
                column._width = column.width;
                column._hasExpand = typeof column.renderExpand === 'function';
                columns.push(column);
                if (colsSpan instanceof Array && colsSpan.length > 0) {
                    colsSpan.forEach(function (item) {
                        colSpanMap.push({
                            ...item,
                            index,
                        })
                    })
                }
            });
            this.colSpanMap = colSpanMap;
            return columns;
        },
        makeColumnRows() {
            return convertToRows(this.columns);
        },
        makeActionData() {
            const data = {};
            (this.data || []).forEach(function (row, index) {
                const newRow = {};
                newRow._isHover = !!row._hover;
                newRow._isHighlight = !!row._highlight;
                newRow._isExpanded = !!row._expanded;
                newRow._index = index;
                data[index] = newRow;
            });
            return data;
        },
        // 用于一些额外的功能函数
        // columnStatus
        handleColumnStatus(type, a, b, c, d) {
            if (type === "sort") {
                this.sortChange(a, b);
                return;
            }
            if (type === "check") {
                if (c === "checkAll") {
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
                    "on-check-change",
                    JSON.parse(JSON.stringify(this.resultData)),
                    checkVals,
                    { key, status: true, type: "checkAll" }
                );
            } else {
                this.$set(check, key, []);
                this.$emit("on-check-change", [], [], {
                    key,
                    status: false,
                    type: "checkAll"
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
                "on-check-change",
                JSON.parse(JSON.stringify(rows)),
                checkVals,
                {
                    key,
                    status,
                    value: curval,
                    type: "check",
                    index,
                }
            );
        },
        sortChange(sort, column) {
            // this.columnStatus.check = {};
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
            this.init();
            this.resultData = resultData;
            this.rebuildData = this.getSizeData;
        },
        filterChange(val, column) {
            // this.columnStatus.check = {};
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
            this.init();
            this.resultData = resultData;
            this.rebuildData = this.getSizeData;
        }
    }
};
