<template>
    <div :class="wrapClasses">
        <span :class="getCellCls(cell)" v-for="cell in cells" @click="handleClick(cell, 'day')" :key="cell.date.month">
            <em>{{
                handleFormatter(
                    langs("datepicker.month", cell.date.month + "月", {month: cell.date.month}),
                    cell,
                    "month"
                )
            }}</em>
        </span>
    </div>
</template>

<script>
import mixins from "./mixins"
export default {
    name: "Date",
    componentName: "DateMonth",
    mixins: [mixins],
    computed: {
        cells() {
            const cells = []
            for (let index = 1; index < 13; index++) {
                cells.push(
                    this.handleCell(
                        {
                            ...this.calendar,
                            month: index,
                        },
                        "month"
                    )
                )
            }
            return cells
        },
    },
}
</script>
