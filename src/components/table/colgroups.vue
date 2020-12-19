<template>
	<colgroup>
		<col v-for="(column,index) in columns" v-bind="setCellWidth(column)" :key="index" />
	</colgroup>
</template>

<script>
export default {
	props: {
		columns: Array
	},
	methods: {
		setCellWidth(column) {
			return column.width ? { width: column.width } : null
		}
	}
};
</script>
