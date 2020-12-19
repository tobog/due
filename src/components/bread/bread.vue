
<template>
	<section :class="_tobogPrefix_" :data-vview-module="$options.name">
		<slot></slot>
	</section>
</template>

<script>
export default {
	name: "Bread",
	props: {
		sep: {
			type: String,
			default: "/"
		}
	},
	methods: {
		updateChildren() {
			this.$nextTick(() => {
				const last = this.$children.length - 1,
					sep = this.sep;
				this.$children.forEach((child, index) => {
					child.visible = true;
					if (last == index) child.visible = false;
					if (!child.sep) child.separator = sep;
				});
			});
		}
	},
	watch: {
		sep() {
			this.updateChildren();
		}
	}
};
</script>
