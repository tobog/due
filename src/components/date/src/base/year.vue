<template>
    <div :class="[_tobogPrefix_ + '-' + prefix]">
        <span :class="getCellCls(cell)" v-for="cell in cells" @click="handleClick(cell, 'month')">
            <em>{{ handleFormatter(cell.date.year, cell, "year") }}</em>
        </span>
    </div>
</template>

<script>
import mixins from "./mixins"
export default {
    name: "Date",
    componentName: "DateYear",
    mixins: [mixins],
    computed: {
        cells() {
            const cells = [],
                start = Math.floor(this.calendar.year / 10) * 10
            for (let i = 0; i < 10; i++) {
                cells.push(this.handleCell({...this.calendar, year: start + i}, "year"))
            }
            return cells
        },
    },
}
</script>
