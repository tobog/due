<template>
    <div :class="wrapClasses" :data-vue-module="$options.name">
        <Header :status="status" :calendar="initCalendar" @on-selected="selected" />
        <component
            v-if="status !== 'times'"
            :class="[_tobogPrefix_ + '-content']"
            :key="status"
            :prefix="status"
            :multiple="multiple"
            :dates="dates"
            :is="componentId"
            :calendar="initCalendar"
            :sectionMethod="sectionMethod"
            :today="getToday"
            :range="range"
            :rangeDate="rangeDate"
            :endState="endState"
            :foucsDate="foucsDate"
            :showWeek="showWeek"
            :format="format"
            :weeks="weeks"
            :firstDayOfWeek="firstDayOfWeek"
            @on-selected="selected"
            @on-range-change="handleRangeChange"
        />
        <component
            v-else
            :format="format"
            :class="[_tobogPrefix_ + '-content']"
            :key="status"
            :is="componentId"
            :sectionMethod="sectionMethod"
            :value="getTimeValue"
            :visible="visible"
            @on-selected="selected"
        />
    </div>
</template>

<script>
import {typeOf} from "../../../utils/tool"
import Dates, {compareEqual} from "../../../utils/dates"
import Year from "./year"
import Month from "./month"
import Day from "./day"
import Times from "./times"
import Header from "./header"

export default {
    name: "Date",
    componentName: "Date",
    components: {
        Header,
        Year,
        Month,
        Day,
        Times,
    },
    props: {
        value: [String, Array, Date],
        format: {
            type: String,
            default: "yy-MM-dd HH:mm:ss",
        },
        multiple: Boolean,
        range: Boolean,
        index: {
            type: [String, Number],
            default: 0,
        },
        startDate: [Number, Date, String],
        sectionMethod: Function,
        showWeek: Boolean,
        weeks: Array,
        firstDayOfWeek: {
            type: Number,
            default: 0,
        },
        visible: Boolean,
        // minDate: [String, Date],
        // maxDate: [String, Date],
    },
    data() {
        return {
            status: "day",
            calendar: null,
            dates: [],
            foucsDate: {},
            rangeDate: {},
            updateValueParse: false, // 通过计算属性更新数值
        }
    },
    created() {
        this.status = this.endState
        this.foucsDate = this.initCalendar
        this.dates = this.valueParse
    },
    watch: {
        startDate: {
            immediate: true,
            handler(val) {
                this.calendar = val || Date.now()
            },
        },
        value: {
            // immediate: true,
            deep: true,
            handler(val) {
                // console.log(val, val.length, this.__dates, this.__datesInstance, "===========")
                if (!val || (Array.isArray(val) && !val.length)) {
                    this.dates = []
                    return
                }
                val = val.toString()
                if (val == this.__dates || val == this.__datesInstance) return
                this.dates = this.valueParse
                this.confirm()
            },
        },
        status(val, old) {
            // 回归 状态
            if (val && !this.getValidStatus[val] && this.getValidStatus[old]) {
                this.status = old
            }
        },
        visible(val) {
            if (!val) {
                this.updateValueParse = !this.updateValueParse
                this.dates = this.valueParse
                // console.log(this.valueParse, this.value, this.linkedDates, "===============")
            }
        },
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-showweek`]: this.showWeek,
                },
            ]
        },
        initCalendar() {
            return Dates.parseObj(this.calendar)
        },
        getTimeValue() {
            if (this.range) {
                const {indexs} = this.getSelectedIndex(this.dates, this.foucsDate, this.status)
                if (indexs) {
                    return this.dates[indexs[0]][this.index]
                }
            }
            return this.foucsDate
        },
        getValidStatus() {
            const format = this.format
            return {
                day: /dd/.test(format),
                month: /MM/.test(format),
                year: /yy/.test(format),
                times: /ss|mm|HH/.test(format),
            }
        },
        endState() {
            const format = this.format
            switch (true) {
                case format.indexOf("dd") > -1:
                    return "day"
                case format.indexOf("MM") > -1:
                    return "month"
                case format.indexOf("yy") > -1:
                    return "year"
                case format.indexOf("ss") > -1:
                case format.indexOf("mm") > -1:
                case format.indexOf("HH") > -1:
                    return "times"
                default:
                    return "day"
            }
        },
        getToday() {
            return Dates.parseObj(new Date())
        },
        getTimeRefs() {
            const refs = [],
                format = this.format
            ;["HH", "mm", "ss"].forEach((val) => {
                if (format.indexOf(val) > -1) {
                    refs.push(val)
                }
            })
            return refs.map((val) => {
                if (val === "HH") return "hours"
                if (val === "mm") return "minutes"
                if (val === "ss") return "seconds"
            })
        },
        linkedDates() {
            let dates = []
            if (this.range) {
                this.dates.forEach((item) => {
                    dates = dates.concat(item)
                })
            } else {
                dates = this.dates
            }
            return dates
        },
        valueParse() {
            let value = (this.updateValueParse || !this.updateValueParse) && this.value,
                type = typeOf(value),
                format = this.format
            if (!value || !value.length) {
                this.$set(this.$data, "foucsDate", this.getToday)
                return []
            }
            console.log(type, "++++++")
            if (type === "string") {
                value = value.split(",").filter((val) => !!val)
            } else if (type === "date") {
                return [Dates.parseObj(value)] //?
            } else if (!this.multiple && this.range && type === "array") {
                value = [value]
            }
            if (typeOf(value) === "array") {
                return value.map((date) => {
                    if (date instanceof Array) {
                        const type = typeOf(date[0])
                        if (type === "string") {
                            date = date[0] + "~" + date[1]
                        } else if (type === "date") {
                            return [Dates.parseObj(date[0]), Dates.parseObj(date[1])]
                        } else {
                            return date
                        }
                    }
                    const vals = Dates.formatParse(date, format)
                    return vals.length <= 1 ? vals[0] : vals
                })
            }
            return null
        },
        componentId() {
            const componentIds = ["Year", "Month", "Day", "Times"],
                index = ["year", "month", "day", "times"].indexOf(this.status)
            if (index > -1) return componentIds[index]
            return null
        },
    },
    methods: {
        handleKeydown(e) {
            const keyCode = e.keyCode,
                status = this.status
            let date = Dates.getTimes(this.foucsDate)
            if (keyCode === 37 || keyCode === 39) {
                const back = keyCode === 37
                switch (status) {
                    case "day":
                        {
                            this.calendar = this.foucsDate = Dates.parseObj(
                                date + (back ? -3600 * 24 * 1000 : 3600 * 24 * 1000)
                            )
                        }
                        break
                    case "month":
                        {
                            date = new Date(date)
                            date.setMonth(date.getMonth() + (back ? -1 : 1))
                            this.calendar = this.foucsDate = Dates.parseObj(date)
                        }
                        break
                    case "year":
                        {
                            date = new Date(date)
                            date.setFullYear(date.getFullYear() + (back ? -1 : 1))
                            this.calendar = this.foucsDate = Dates.parseObj(date)
                        }
                        break
                    // case 'times':
                    // 	{
                    // 		const refs = this.getTimeRefs,
                    // 			length = refs.length - 1;
                    // 		let index = refs.indexOf(this.foucsDate.key)
                    // 		if (index > -1) {
                    // 			if (back) {
                    // 				index = index <= 0 ? index : index - 1;
                    // 			} else {
                    // 				index = index >= length ? index : index + 1;
                    // 			}
                    // 			console.log(refs[index])
                    // 			this.$set(this.$data, 'foucsDate', {
                    // 				...this.foucsDate,
                    // 				key: refs[index]
                    // 			})
                    // 		}
                    // 	};
                    // 	break;
                }
                return
            }
            if (keyCode === 38 || keyCode === 40) {
                const back = keyCode === 38
                switch (status) {
                    case "day":
                        {
                            this.calendar = this.foucsDate = Dates.parseObj(
                                date + (back ? -3600 * 24 * 1000 * 7 : 3600 * 24 * 1000 * 7)
                            )
                        }
                        break
                    case "month":
                        {
                            date = new Date(date)
                            date.setMonth(date.getMonth() + (back ? -3 : 3))
                            this.calendar = this.foucsDate = Dates.parseObj(date)
                        }
                        break
                    case "year":
                        {
                            date = new Date(date)
                            date.setFullYear(date.getFullYear() + (back ? -3 : 3))
                            this.calendar = this.foucsDate = Dates.parseObj(date)
                        }
                        break
                    // case 'times':
                    // 	{
                    // 		this.$set(this.foucsDate, 'key', 'hours');
                    // 	};
                    // 	break;
                }
                return
            }

            if (keyCode === 13) {
                this.selected({date: this.calendar, isKeyEnter: true}, status)
            }
        },
        handleRangeChange(cell) {
            // if (cell && cell.date && this.status == this.endState) {
            if (cell && this.status == this.endState) {
                this.rangeDate = cell.date
                this.$emit(
                    "on-sync-update",
                    {
                        date: cell.date,
                        index: this.index,
                    },
                    "range"
                )
            }
        },
        confirm(isEnd, isKeyEnter) {
            const length = this.linkedDates.length
            if (this.range && (length % 2 == 1 || (!length && isKeyEnter))) return
            // if (this.range && !length && isKeyEnter) return;
            let format = this.format,
                datestrList = [],
                datesInstance = []
            this.dates.forEach((date, index) => {
                if (date instanceof Array) {
                    if (date.length > 1) {
                        datesInstance.push([Dates.New(date[0]), Dates.New(date[1])])
                    } else {
                        return
                    }
                } else {
                    datesInstance.push(Dates.New(date))
                }
                datestrList.push(Dates.stringify(date, format))
            })
            if (!this.multiple) {
                datestrList = datestrList[0] || ""
                datesInstance = datesInstance[0] || null
            }
            const datestring = datestrList.toString(),
                // singleDate = this.range && length % 2 == 1,
                preDates = this.__dates
            this.__dates = datestring
            this.__datesInstance = datesInstance && datesInstance.toString()
            // console.log(preDates, datestring);
            // if (preDates && preDates === datestring && !singleDate) {
            if (preDates && preDates === datestring) {
                return
            }
            this.$emit(
                "on-selected",
                {
                    datesInstance,
                    dates: datestrList,
                    index: this.index,
                    endState: isEnd ? this.endState : "",
                    // singleDate,
                },
                isEnd
            )
        },
        getSelectedIndex(dates = [], date, status) {
            if (!date) return {}
            const getIndex = function(list, date, status) {
                return list.findIndex((item) => {
                    return compareEqual(item, status, date)
                })
            }
            if (!this.range) return getIndex(dates, date, status)
            let indexs, singleIndex
            dates.forEach((items, index) => {
                const _index = getIndex(items, date, status)
                if (_index >= 0 && !indexs) {
                    indexs = [index, _index]
                }
                if (singleIndex === void 0 && items.length == 1) {
                    singleIndex = index
                }
            })
            return {indexs, singleIndex}
        },
        selected(cell, next) {
            let status = this.status,
                isEnd = status === this.endState,
                isTimes = status === "times",
                multiple = this.multiple,
                dates = this.dates,
                invalidStatus = !this.getValidStatus[next]
            if (cell && cell.date) {
                // 有日期数据
                let date = {
                    ...this.initCalendar,
                    ...cell.date,
                }
                this.$set(this.$data, "calendar", date)
                if (isTimes && !isEnd) {
                    //选择时分秒但不是结束
                    this.$set(this.$data, "foucsDate", date)
                    if (dates.length == 0) {
                        this.$set(this.dates, 0, this.range ? [date] : date)
                    } else {
                        let item = this.linkedDates.find((item) => {
                            //isfocus and selected
                            return compareEqual(item, this.endState, date)
                        })
                        if (item) item = Object.assign(item, date)
                    }
                    this.$nextTick(() => {
                        this.confirm(false)
                    })
                }
                if ((next || isTimes) && isEnd) {
                    //结束选择
                    const isKeyEnter = cell.isKeyEnter
                    this.$set(this.$data, "foucsDate", date)
                    if (this.range && !isTimes) {
                        const {indexs, singleIndex} = this.getSelectedIndex(dates, date, status)
                        if (indexs) {
                            let dateItems = dates[indexs[0]]
                            if (dateItems.length == 1) {
                                dates[indexs[0]].push(date)
                                // dates.splice(indexs[0], 1);
                            } else {
                                dateItems = dateItems[1 - indexs[1]]
                                if (singleIndex === void 0) {
                                    dates[indexs[0]] = [dateItems]
                                } else {
                                    let singleDate = dates[singleIndex][0]
                                    dates[indexs[0]] =
                                        Dates.getTimes(singleDate) > Dates.getTimes(dateItems)
                                            ? [dateItems, singleDate]
                                            : [singleDate, dateItems]
                                    dates.splice(singleIndex, 1)
                                }
                            }
                        } else if (singleIndex === void 0) {
                            if (multiple) {
                                dates.push([date])
                            } else {
                                dates = [[date]]
                            }
                        } else {
                            if (Dates.getTimes(dates[singleIndex][0]) < Dates.getTimes(date)) {
                                dates[singleIndex].push(date)
                            } else {
                                dates[singleIndex].unshift(date)
                            }
                        }
                    } else if (!isTimes) {
                        const index = this.getSelectedIndex(dates, date, status)
                        if (index >= 0) {
                            if (!isKeyEnter) dates.splice(index, 1)
                        } else {
                            if (multiple) {
                                dates.push(date)
                            } else {
                                dates = [date]
                            }
                        }
                    } else if (this.range) {
                        // istimes isrange
                        if (!dates[0]) dates[0] = []
                        dates[0][this.index] = date
                    } else {
                        dates = [date]
                    }
                    this.dates = [...dates]
                    this.$nextTick(() => {
                        this.confirm(isTimes ? next === "times" : isEnd, isKeyEnter)
                    })
                }
                this.$emit(
                    "on-sync-update",
                    {
                        date,
                        direction: cell.direction,
                        dates: this.dates,
                        index: this.index,
                        status: invalidStatus ? this.status : next,
                    },
                    "calendar"
                )
            }
            if (invalidStatus) return
            if ((next && !isEnd) || (next && next !== this.endState)) this.status = next
        },
    },
}
</script>
