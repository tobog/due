<template>
    <section :class="wrapClasses" :data-week="showWeek" @mouseleave="handleMouseMove(null)">
        <span v-for="cell in handleWeeks" :class="getCellCls({type: 'week'})">
            <em>{{ handleFormatter(cell, handleWeeks, "week") }}</em>
        </span>
        <template v-for="(cell, index) in cells">
            <span v-if="showWeek && index % 7 == 0" :class="getCellCls({type: 'weeks'})">
                <em>{{ handleFormatter(getWeekIndex(cell.date), null, "weeks") }}</em>
            </span>
            <span :class="getCellCls(cell)" @click="handleClick(cell, 'day')" @mouseenter="handleMouseMove(cell)">
                <em>{{ handleFormatter(cell.date.day, cell, "day") }}</em>
            </span>
        </template>
    </section>
</template>

<script>
import mixins from "./mixins"
export default {
    name: "Date",
    componentName: "DateDay",
    mixins: [mixins],
    computed: {
        handleWeeks() {
            let weeks = this.weeks || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            let firstDayOfWeek = this.firstDayOfWeek % 7
            if (firstDayOfWeek > 0) {
                weeks = [...weeks.slice(firstDayOfWeek), ...weeks.slice(0, firstDayOfWeek)]
            }
            if (this.showWeek) weeks.unshift("")
            return weeks
        },
        cells() {
            const {year, month} = this.calendar,
                cells = [],
                nextMonth = month == 12 ? 1 : month + 1,
                startDate = new Date(year, month - 1, 1),
                week = startDate.getDay(),
                endDay = new Date(year, month, 0).getDate()
            for (let index = 1; index <= endDay; index++) {
                cells.push({
                    type: "cur",
                    ...this.handleCell({...this.calendar, day: index}, "day"),
                })
            }
            // if (week != this.firstDayOfWeek) {
            // }
            let preMonth = month - 1,
                preYear = year,
                preWeek = (week - this.firstDayOfWeek + 7) % 7
            if (week == this.firstDayOfWeek) preWeek += 7
            if (month == 1) {
                preMonth = 12
                preYear = preYear - 1
            }
            let day = new Date(preYear, preMonth, 0).getDate()
            for (let index = day, end = day - preWeek; index > end; index--) {
                const date = {...this.calendar, day: index, month: preMonth, year: preYear}
                cells.unshift({
                    disabled: this.hasSectionMethod && this.sectionMethod(date, "day"),
                    type: "pre",
                    date,
                })
            }
            const nextYear = month == 12 ? year + 1 : year
            for (let index = 1, end = 42 - cells.length; index <= end; index++) {
                const date = {...this.calendar, day: index, month: nextMonth, year: nextYear}
                cells.push({
                    type: "next",
                    date,
                    disabled: this.hasSectionMethod && this.sectionMethod(date, "day"),
                })
            }
            return cells
        },
    },
    methods: {
        // showWeeks(index) {
        //     return this.showWeek && index % 7 == 0
        // },
        getWeekIndex(date) {
            const {year, month, day} = date,
                start = new Date(year, 0, 1, 0, 0, 0),
                end = new Date(year, month - 1, day, 0, 0, 0)
            end.setDate(day + 6 - end.getDay())
            return Math.ceil((end - start) / 86400000 / 7)
        },
    },
}
</script>
