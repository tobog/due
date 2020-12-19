

<template>
	<span :class="wrapClasses" @click="toggleSort">
		<span :class="handleActive('asc')" @click.stop="sortChange('asc')"></span>
		<span :class="handleActive('desc')" @click.stop="sortChange('desc')"></span>
	</span>
</template>

<script>
export default {
	name: 'Sort',
	props: ['sort', 'data', 'theme'],
	data() {
		return {
			status: this.sort || "",
		}
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
				},
			];
		},
	},
	watch: {
		sort(val) {
			this.status = val || "";
		},
		status(val) {
			if (this.sort === val) return;
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
			this.status = this.status === sort ? '' : sort;
		},
		handleActive(sort) {
			return this.status == sort ? this._tobogPrefix_ + '-active' : ''
		},
	},
};
</script>
