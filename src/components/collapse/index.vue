
<template>
	<section :class="classes" :data-vue-module="$options.name">
		<slot></slot>
	</section>
</template>
<script>
export default {
	name: "Collapse",
	props: {
		multiple: {
			type: Boolean,
			default: false
		},
		value: [Array, String, Number],
		strict: Boolean,
		simple: Boolean,
	},
	data() {
		return {
			model: this.value
		};
	},
	mounted() {
		this.setActive();
	},
	computed: {
		classes() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-simple`]: this.simple
				}
			]
		},
	},
	methods: {
		setActive() {
			const value =
				Array.isArray(this.model) ? this.model : [this.model];
			const strict = this.strict;
			this.$children.forEach((child, index) => {
				let name = child.nameUid;
				if (!name && name != "0") name = child.index = index;
				child.isActive = value.some(function (val) {
					return strict ? val === name : val == name;
				});
			});
		},
		toggle(data) {
			const name = data.name;
			let value = Array.isArray(this.model) ? this.model : [this.model];
			if (this.multiple) {
				const strict = this.strict;
				const nameIndex = value.findIndex(function (val) {
					return strict ? val === name : val == name;
				});
				if (nameIndex > -1) {
					value.splice(nameIndex, 1);
				} else {
					value.push(name);
				}
			} else {
				value = data.isActive ? [] : [name];
			}
			this.model = value;
			this.$emit("input", value);
			this.$emit("on-change", value);
		}
	},
	watch: {
		value(val) {
			if (val === this.model) return;
			this.model = val;
		},
		model(val) {
			this.setActive();
		}
	}
};
</script>
