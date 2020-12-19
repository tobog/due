
<template>
	<section :class="wrapClasses">
		<span :class="getCellCls(cell)" v-for="cell in cells" @click="handleClick(cell,'day')">
			<em>{{langs('datepicker.month',cell.date.month+'月',{month:cell.date.month})}}</em>
		</span>
	</section>
</template>

<script>
import mixins from './mixins'

export default {
	name: 'Date',
	mixins: [mixins],
	computed: {
		cells() {
			const cells = [];
			for (let index = 1; index < 13; index++) {
				cells.push(this.handleCell({
					...this.calendar,
					month: index
				}, 'month'));
			}
			return cells;
		}
	}
};
</script>
