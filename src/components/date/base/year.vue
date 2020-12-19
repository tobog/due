<template>
    <div :class="wrapClasses">
        <span :class="getCellCls(cell)" v-for="cell in cells" @click="handleClick(cell, 'month')">
            <em>{{ cell.date.year }}</em>
        </span>
    </div>
</template>

<script>
import mixins from './mixins';
export default {
    name: 'Date',
    mixins: [mixins],
    computed: {
        start() {
            return Math.floor(this.calendar.year / 10) * 10;
        },
        cells() {
            const cells = [],
                start = this.start;
            for (let i = 0; i < 10; i++) {
                cells.push(this.handleCell({ ...this.calendar, year: start + i }, 'year'));
            }
            return cells;
        },
    },
};
</script>
