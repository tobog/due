import Dates, { compareEqual } from "../../../../utils/dates";
import langMinix from '../../../../mixins/lang'
export default {
    mixins: [langMinix],
    props: {
        calendar: Object,
        dates: Array,
        multiple: Boolean,
        disableMethod: Function,
        today: Object,
        range: Boolean,
        foucsDate: Object,
        prefix: String,
        rangeDate: Object,
        endState: String,
        format: String,
        showWeek: Boolean,
        firstDayOfWeek: Number,
        cellFormatter: Function,
        maxDate: [String, Date, Object, Number],
        minDate: [String, Date, Object, Number],
        theme: String,
        // index: {
        //     type: [String, Number],
        //     default: 0,
        // },
        // startDate: [Number, Date, String],
        // doublePanel: Boolean
    },
    data() {
        return {
            
        };
    },
    computed: {
        hasDisableMethod() {
            return typeof this.disableMethod === "function";
        },
        linkedDates() {
            let dates = [];
            if (this.range) {
                this.dates.forEach(item => {
                    dates = dates.concat(item);
                });
            } else {
                dates = this.dates;
            }
            return dates;
        },
        getMaxDate() {
            if(!this.maxDate) return null;
            return Dates.parseObj(this.maxDate, true);
        },
        getMinDate() {
            if(!this.maxDate) return null;
            return Dates.parseObj(this.minDate);
        },
        // getStartDate() {
        //     if(!this.startDate) return null;
        //     return Dates.parseObj(this.startDate);
        // }
    },
    methods: {
        handleDisable(date, type) {
            // if (this.index == 1 && this.doublePanel && this.range && this.getStartDate) {

            // }
            if (this.hasDisableMethod && this.disableMethod(date, type)) return true;
            if (this.getMinDate) {
                if (type === 'day' && (
                        date.year < this.getMinDate.year ||
                        date.month < this.getMinDate.month ||
                        date.day < this.getMinDate.day )) {
                    return true
                }
                if (type === 'month' && (
                    date.year < this.getMinDate.year ||
                    date.month < this.getMinDate.month )) {
                    return true
                }
                if (type === 'year' && date.year < this.getMinDate.year) {
                    return true
                }
            }
            if (this.getMaxDate) {
                if (type === 'day' && (
                        date.year > this.getMaxDate.year ||
                        date.month > this.getMaxDate.month ||
                        date.day > this.getMaxDate.day )) {
                    return true
                }
                if (type === 'month' && (
                    date.year > this.getMaxDate.year ||
                    date.month > this.getMaxDate.month )) {
                    return true
                }
                if (type === 'year' && date.year > this.getMaxDate.year) {
                    return true
                }
            }
            return false
        },
        handleSelect(type, date) {
            if (this.endState === this.prefix) {
                return  this.linkedDates.some(item => compareEqual(item, type, date))
            }
            return compareEqual(this.foucsDate, type, date);
        },
        handleCell(date, type) {
            return {
                date,
                selected: this.handleSelect(type, date),
                disabled: this.handleDisable({ ...date }, type),
                inRange: this.handleSection(date, this.rangeDate),
                now: compareEqual(date, type, this.today),
                focus: compareEqual(date, type, this.foucsDate)
            };
        },
        handleSection(date, compare) {
            if (
                !this.range ||
                this.endState !== this.prefix ||
                this.dates.length == 0 ||
                !date
            )
                return false;
            const handleRange = function (date, compare, dates) {
                let start = Dates.getTimes(dates[0], true);
                date = Dates.getTimes(date, true);
                if (dates.length > 1) {
                    compare = Dates.getTimes(dates[1], true);
                } else if (!compare) {
                    return false;
                } else {
                    compare = Dates.getTimes(compare, true);
                }
                if (start > compare) {
                    let temp = start;
                    start = compare;
                    compare = temp;
                }
                return date >= start && date <= compare;
            };
            if (this.multiple) {
                return this.dates.some(items => {
                    return handleRange(date, compare, items);
                });
            } else {
                return handleRange(date, compare, this.dates[0]);
            }
        },
        handleMouseMove(cell) {
            if ((cell && cell.disabled) || !this.range) return;
            this.$emit("on-range-change", { ...cell });
        },
        handleClick(cell, next) {
            if (cell && cell.disabled) return;
            this.$emit("on-selected", { ...cell }, next);
        },
        getCellCls(cell) {
            const _tobogPrefix_ = this._tobogPrefix_,
                prefix = this.prefix;
            return [
                `${_tobogPrefix_}-cell`,
                `${_tobogPrefix_}-${prefix}-cell`,
                {
                    [`${_tobogPrefix_}-${prefix}-cell-${cell.type}`]: cell.type,
                    [`${_tobogPrefix_}-cell-selected`]: cell.selected,
                    [`${_tobogPrefix_}-cell-focus`]: cell.focus,
                    [`${_tobogPrefix_}-cell-disabled`]: cell.disabled,
                    [`${_tobogPrefix_}-cell-now`]: cell.now,
                    [`${_tobogPrefix_}-cell-range`]: cell.inRange,
                }
            ];
        },
        handleFormatter(val, cell, type) {
            return typeof this.cellFormatter === 'function' ? this.cellFormatter(val, cell, type) : val
        },
    }
};
