import Dates, { compareEqual } from "../../../utils/dates";
import langMinix from '../../../mixins/lang'
export default {
    mixins: [langMinix],
    props: {
        calendar: Object,
        dates: Array,
        multiple: Boolean,
        sectionMethod: Function,
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
        // minDate: [String, Date],
        // maxDate: [String, Date],
    },
    data() {
        return {

        };
    },
    computed: {
        wrapClasses() {
            return this._tobogPrefix_ + this.prefix;
        },
        hasSectionMethod() {
            return typeof this.sectionMethod === "function";
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
        }
    },
    methods: {
        handleFormatter(val, cell, type) {
            return typeof this.cellFormatter === 'function' ? this.cellFormatter(val, cell, type) : val
        },
        // handleEqual: compareEqual,
        handleCell(date, type) {
            return {
                date,
                selected: this.linkedDates.some(item =>  compareEqual(item, type, date)),
                disabled: this.hasSectionMethod && this.sectionMethod({ ...date }, type),
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
                `${_tobogPrefix_}${prefix}-cell`,
                {
                    [`${_tobogPrefix_}${prefix}-cell-${cell.type}`]: cell.type,
                    [`${_tobogPrefix_}-cell-selected`]: cell.selected,
                    [`${_tobogPrefix_}-cell-focus`]: cell.focus,
                    [`${_tobogPrefix_}-cell-disabled`]: cell.disabled,
                    [`${_tobogPrefix_}-cell-now`]: cell.now,
                    [`${_tobogPrefix_}-cell-range`]: cell.inRange,
                }
            ];
        }
    }
};
