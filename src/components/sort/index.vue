

<template>
	<div :class="_tobogPrefix_" @click="toggleSort">
		<span :class="handleActive('asc')" @click.stop="sortChange('asc')"></span>
		<span :class="handleActive('desc')" @click.stop="sortChange('desc')"></span>
	</div>
</template>

<script>
export default {
	name: 'Sort',
	props: ['sort', 'data'],
	data() {
		return {
			status: this.sort || "",
		}
	},
	watch: {
		sort(val) {
			this.status = val || "";
		},
		status(val) {
			this.$emit('on-change', val, this.data);
		}
	},
	methods: {
		toggleSort() {
			const sort = ['', 'desc', 'asc'], index = sort.indexOf(this.status);
			if (index == -1 || index >= 2) {
				this.status = ''
			} else {
				this.status = sort[index + 1];
			}
		},
		sortChange(sort = 'desc') {
			this.status = this.status === sort ? "" : sort;
		},
		handleActive(sort) {
			return this.status == sort ? this._tobogPrefix_ + '-active' : ''
		},
	},
};
</script>
