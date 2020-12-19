<template>
	<colgroup>
		<col
			v-for="(column,index) in columns"
			v-bind="column.col"
			:key="index"
			:width="setCellWidth(column)"
		>
	</colgroup>
</template>

<script>
export default {
	props: {
		columns: Array
	},
	methods: {
		setCellWidth(column) {
			return column._width || column.width;
		}
	}
};
</script>
