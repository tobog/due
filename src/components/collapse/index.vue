
<template>
	<section :class="_tobogPrefix_" :data-vview-module="$options.name">
		<slot></slot>
	</section>
</template>
<script>
export default {
	name: 'Collapse',
	props: {
		single: {
			type: Boolean,
			default: true
		},
		value: {
			type: [Array, String, Number]
		},
		strict: Boolean
	},
	data() {
		return {
			model: this.value,
		};
	},
	mounted() {
		this.setActive();
	},
	methods: {
		setActive() {
			const value = this.model instanceof Array ? this.model : [this.model];
			const strict = this.strict;
			this.$children.forEach((child, index) => {
				const name = child.nameUid;
				child.isActive = (value.findIndex(function (val) {
					return strict ? val === name : val == name
				})) > -1;
			});
		},
		toggle(data) {
			const name = data.name;
			let value = this.model instanceof Array ? this.model : [this.model];
			if (this.single) {
				value = data.isActive ? [] : [name];
			} else {
				const strict = this.strict;
				const nameIndex = value.findIndex(function (val) {
					return strict ? val === name : val == name
				});
				if (nameIndex > -1) {
					value.splice(nameIndex, 1);
				} else {
					value.push(name);
				}
			}
			this.model = value;
			this.$emit('input', value);
			this.$emit('on-change', value);
		}
	},
	watch: {
		value(val) {
			this.model = val;
		},
		model(val) {
			this.setActive();
		},
	}
};
</script>
